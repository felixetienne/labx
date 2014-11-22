
/*
 * GET home page.
 */

//var async = require('async');
var repo = require('./repositories');
var imageFolder = "/medias/images/tmp/";
var StatesMachine = require('../objects/StatesMachine');

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

        if(statesMachine.hasError()) {
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
        if(statesMachine.hasError()) return;
        statesMachine.errorOccur();
        res.render('404');
    };

    var statesMachine = new StatesMachine(
        // condition
        function(){ return data.page && data.project; },
        // callback
        function(){ renderView(); });

    repo.projects.getFromName(req.params.name, imageFolder, function(project){
        statesMachine.tryCallback(function(){
            data.project = project;
        });
    }, renderErrorView);

    repo.pages.getFromName(name, function(page){
        statesMachine.tryCallback(function(){
            data.page = page;
        });
    }, renderErrorView);

//*** Using Async module ***

//    var error = false;

//    var renderView = function(){
//
//        if(error) {
//            renderErrorView();
//            return;
//        }
//
//        res.render(name, {
//            page:{
//                title: data.page.pageTitle
//            },
//            content: {
//                title: data.page.title,
//                shortTitle: data.page.shortTitle,
//                text: data.page.text
//            },
//            project: {
//                title: data.project.title,
//                image: {
//                    title: data.project.image.title,
//                    url: data.project.image.path
//                }
//            }
//        });
//    };
//
//    var renderErrorView = function (){
//        if(error) return;
//        error = true;
//        res.render('404');
//    };
//
//    async.parallel([
//        function(){
//            repo.projects.getFromName(req.params.name, imageFolder, function(project){
//                data.project = project;
//            }, renderErrorView);
//        },
//        function(){
//            repo.pages.getFromName(name, function(page){
//                data.page = page;
//            }, renderErrorView);
//        }
//    ], renderView);
};
