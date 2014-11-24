var BaseService = require('./BaseService');
var StatesMachine = require('../StatesMachine');

module.exports = function PageService(context, repositoriesFactory){

    var _base = new BaseService(context);
    var _pagesRepository = repositoriesFactory.createPagesRepository();

    this.getData = function(successAction, errorAction){
        var result = {};

         var onError = function (){
            if(statesMachine.hasError()) return;
            statesMachine.errorOccur();
            errorAction();
        }

        var onCompleted = function(){

            if(statesMachine.hasError()) {
                onError();
                return;
            }

            var data = {
                page:{
                    title: result.page.pageTitle
                },
                content: {
                    title: result.page.title,
                    shortTitle: result.page.shortTitle,
                    text: result.page.text
                },
                allPages: result.allPages
            };

            successAction(data);
        };

        var statesMachine = new StatesMachine(
            // condition
            function(){ return result.page && result.allPages; },
            // callback
            function(){ onCompleted(); });

        _pagesRepository.getPageByName(_base.currentView, function(page){
            statesMachine.tryCallback(function(){ result.page = page; });
        }, onError);

        _pagesRepository.getBasicPages(function(pages){
            statesMachine.tryCallback(function(){ result.allPages = pages; });
        }, onError);
    }
}
