var BasePageService = require('./BasePageService');
var StatesMachine = require('../StatesMachine');

module.exports = function ProjectPageService(context, repositoriesFactory){

    var _base = new BasePageService(context);
    var _pagesRepository = repositoriesFactory.createPagesRepository();
    var _projectsRepository = repositoriesFactory.createProjectsRepository();

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

            data.project = {
                title: x.project.title,
                image: {
                    title: x.project.image.title,
                    url: x.project.image.path
                }
            };

            successAction(data);
        };

        var statesMachine = new StatesMachine(
            // condition
            function(x){ return x.page && x.project && x.allPages; },
            // callback
            function(x){ onCompleted(x); });

        _pagesRepository.getPageByName(_base.currentView, function(page){
            statesMachine.tryCallback(result, function(x){ x.page = page; });
        }, onError);

        _pagesRepository.getBasicPages(function(pages){
            statesMachine.tryCallback(result, function(x){ x.allPages = pages; });
        }, onError);

        _projectsRepository.getProjectByName(_base.currentRequest.params.name, _base.config.getImageFolder(), function(project){
            statesMachine.tryCallback(result, function(x){ x.project = project; });
        }, onError);
    }
}
