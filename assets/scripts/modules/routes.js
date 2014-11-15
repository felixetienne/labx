
/*
 * GET home page.
 */

var repo = require('./repositories');
var imageFolder = "/medias/images/tmp/";

exports.index = function(req, res){
    var name = 'index';

    repo.pages.getFromName(name, function(page){

        res.render(name, {
            page:{
                    title: page.pageTitle
                },
                content: {
                    title: page.title,
                    shortTitle: page.shortTitle,
                    text: page.text
                }
        });
    }, function(){
         res.render('404');
    });
};

exports.about = function(req, res){
    var name = 'about';

    repo.pages.getFromName(name, function(page){
        res.render(name, {
            page:{
                    title: page.pageTitle
                },
                content: {
                    title: page.title,
                    shortTitle: page.shortTitle,
                    text: page.text
                }
        });
    }, function(){
         res.render('404');
    });
};

exports.contact = function(req, res){
    var name = 'contact';

    repo.pages.getFromName(name, function(page){
        res.render(name, {
            page:{
                title: page.pageTitle
            },
            content: {
                title: page.title,
                shortTitle: page.shortTitle,
                text: page.text
            }
        });
    }, function(){
         res.render('404');
    });
};

exports.project = function(req, res){
    var name = 'project';

    var states = (function(onCallback){
        var error = false;
        var projectIsLoaded = false;
        var pageIsLoaded = false;
        var data = {};

        return {
            errorOccur: function(){ error = true; },
            hasError: function(){ return error; },
            isReady: function(){ return projectIsLoaded && pageIsLoaded; },
            getData: function(){ return data; },
            setPageData: function(page){
                data.page = page;
                pageIsLoaded = true;
                onCallback();
            },
            setProjectData: function(project){
                data.project = project;
                projectIsLoaded = true;
                onCallback();
            }
        };
    })(function(){ renderView(); });

    var renderView = function(){

        if(!states.isReady()) return;

        if(states.hasError()) {
            renderErrorView();
            return;
        }

        var data = states.getData();

        res.render(name, {
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

    var renderErrorView = function (){
        if(states.hasError()) return;
        states.errorOccur();
        res.render('404');
    };

    repo.projects.getFromName(req.params.name, imageFolder, states.setProjectData, renderErrorView);
    repo.pages.getFromName(name, states.setPageData, renderErrorView);
};
