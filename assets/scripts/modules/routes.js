
/*
 * GET home page.
 */

var repo = require('./repositories');
//var _ = require('underscore');

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
    var page = null;
    var project = null;
    var hasError = false;

    var isReady = function(){
        if(hasError) return false;
        if(page == null) return false;
        if(project == null) return false;

        return true;
    };

    var renderView = function(){

        if(!isReady()) return;

         res.render(name, {
            page:{
                title: page.pageTitle
            },
            content: {
                title: page.title,
                shortTitle: page.shortTitle,
                text: page.text
            },
            project: {
                title: project.projectTitle,
                image: {
                    title: project.imageTitle,
                    url: project.imageUrl
                }
            }
        });
    };

    var renderErrorView = function (){
        if(hasError) return;

        hasError = true;

        res.render('404');
    };

    repo.projects.getFromName(req.params.name, function(data){
        page = data;

        renderView();

    }, renderErrorView);

    repo.pages.getFromName(name, function(data){
        project = data;

        renderView();

    }, renderErrorView);
};
