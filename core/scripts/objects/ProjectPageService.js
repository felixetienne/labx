var StatesMachine = require('./StatesMachine');

module.exports = function ProjectPageService(context, repo){

    var _appConfig = require('../modules/appConfig');

    this.getData = function(successAction, errorAction){

        var request = context.getCurrentRequest();
        var data = {};

        var onError = function (){
            if(statesMachine.hasError()) return;
            statesMachine.errorOccur();
            errorAction();
        };

        var onCompleted = function(){

            if(statesMachine.hasError()) {
                onError();
                return;
            }

            successAction({
                page:{
                    title: data.page.pageTitle
                },
                content: {
                    title: data.page.title,
                    shortTitle: data.page.shortTitle,
                    text: data.page.text
                },
                project: {
                    title: data.project.title,
                    image: {
                        title: data.project.image.title,
                        url: data.project.image.path
                    }
                }
            });
        };

        var statesMachine = new StatesMachine(
            // condition
            function(){ return data.page && data.project; },
            // callback
            function(){ onCompleted(); });

        repo.projects.getFromName(request.params.name, _appConfig.imageFolder, function(project){
            statesMachine.tryCallback(function(){
                data.project = project;
            });
        }, onError);

        repo.pages.getFromName(context.getCurrentView(), function(page){
            statesMachine.tryCallback(function(){
                data.page = page;
            });
        }, onError);
    };
}
