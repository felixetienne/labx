
/*
 * GET home page.
 */

var States = require('../objects/States');
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
    var data = {};

    var renderView = function(){

        if(states.hasError()) {
            renderErrorView();
            return;
        }

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

    var states = new States(
        function(){ return data.page && data.project; },
        function(){ renderView(); });

    repo.projects.getFromName(req.params.name, imageFolder, function(project){
        data.project = project;
        states.test();
    }, renderErrorView);

    repo.pages.getFromName(name, function(page){
        data.page = page;
        states.test();
    }, renderErrorView);
};
