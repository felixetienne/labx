var BaseService = require('./BaseService');
var StatesMachine = require('../StatesMachine');

module.exports = function ProjectPageService(context, repositoriesFactory){

    var _base = new BaseService(context);
    var _pagesRepository = repositoriesFactory.createPagesRepository();
    var _projectsRepository = repositoriesFactory.createProjectsRepository();

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
                project: {
                    title: result.project.title,
                    image: {
                        title: result.project.image.title,
                        url: result.project.image.path
                    }
                },
                allPages: result.allPages
            };

            successAction(data);
        };

        var statesMachine = new StatesMachine(
            // condition
            function(){ return result.page && result.project && result.allPages; },
            // callback
            function(){ onCompleted(); });

        _pagesRepository.getPageByName(_base.currentView, function(page){
            statesMachine.tryCallback(function(){ result.page = page; });
        }, onError);

        _pagesRepository.getBasicPages(function(pages){
            statesMachine.tryCallback(function(){ result.allPages = pages; });
        }, onError);

        _projectsRepository.getProjectByName(_base.currentRequest.params.name, _base.config.getImageFolder(), function(project){
            statesMachine.tryCallback(function(){ result.project = project; });
        }, onError);
    }
}
