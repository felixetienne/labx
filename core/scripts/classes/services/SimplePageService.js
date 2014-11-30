(function(BasePageService, StatesMachine){

    module.exports = function (context, repositoriesFactory){

        var _base = new BasePageService(context);
        var _pagesRepository = repositoriesFactory.createPagesRepository();

        this.getData = function(successAction, errorAction){
            var result = {};

             var onError = function (){
                if(statesMachine.hasError()) return;
                statesMachine.errorOccur();
                errorAction();
            }

            var onCompleted = function(x){

                if(statesMachine.hasError()) {
                    onError();
                    return;
                }

                var data = _base.getPageData(x);

                successAction(data);
            };

            var statesMachine = new StatesMachine(
                // condition
                function(x){ return x.page && x.allPages; },
                // callback
                function(x){ onCompleted(x); });

            _pagesRepository.getPageByName(_base.currentView, function(page){
                statesMachine.tryCallback(result, function(x){ x.page = page; });
            }, onError);

            _pagesRepository.getBasicPages(function(pages){
                statesMachine.tryCallback(result, function(x){ x.allPages = pages; });
            }, onError);
        }
    }

})(require('./BasePageService'),
   require('../StatesMachine'));
