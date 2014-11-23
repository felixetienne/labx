var StatesMachine = require('../StatesMachine');

module.exports = function ProjectPageService(context, repositoriesFactory){

    var _appConfig = require('../../modules/appConfig');

    this.getData = function(successAction, errorAction){

        var request = context.getCurrentRequest();
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
                }
            };

            successAction(data);
        };

        var statesMachine = new StatesMachine(
            // condition
            function(){ return result.page && result.project; },
            // callback
            function(){ onCompleted(); });

        var pagesRepo = repositoriesFactory.createPagesRepository();
        var projectsRepo = repositoriesFactory.createProjectsRepository();

        pagesRepo.getPageByName(context.getCurrentView(), function(page){
            statesMachine.tryCallback(function(){ result.page = page; });
        }, onError);

        projectsRepo.getProjectByName(request.params.name, _appConfig.getImageFolder(), function(project){
            statesMachine.tryCallback(function(){ result.project = project; });
        }, onError);
    }
}
