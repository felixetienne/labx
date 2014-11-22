
/*
 * GET home page.
 */

var Context = require('../objects/Context');
var servicesFactory = require('./servicesFactory');
var viewsMap = require('./viewsMap');

var context = new Context();

exports.index = function(req, res){

    context
    .setCurrentRequest(req)
    .setCurrentView(viewsMap.default);

    servicesFactory
    .createPageService(context)
    .getData(
        function(data){ res.render(context.getCurrentView(), data); },
        function(){ res.render(context.getErrorView()); });
};

exports.about = function(req, res){

    context
    .setCurrentRequest(req)
    .setCurrentView(viewsMap.about);

    servicesFactory
    .createPageService(context)
    .getData(
        function(data){ res.render(context.getCurrentView(), data); },
        function(){ res.render(context.getErrorView()); });
};

exports.contact = function(req, res){

    context
    .setCurrentRequest(req)
    .setCurrentView(viewsMap.contact);

    servicesFactory
    .createPageService(context)
    .getData(
        function(data){ res.render(context.getCurrentView(), data); },
        function(){ res.render(context.getErrorView()); });
};

exports.project = function(req, res){

    context
    .setCurrentRequest(req)
    .setCurrentView(viewsMap.project);

    servicesFactory
    .createPageService(context)
    .getData(
        function(data){ res.render(context.getCurrentView(), data); },
        function(){ res.render(context.getErrorView()); });

//    var name = 'project';
//    var data = {};
//
//    var renderView = function(){
//
//        if(statesMachine.hasError()) {
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
//        if(statesMachine.hasError()) return;
//        statesMachine.errorOccur();
//        res.render('404');
//    };
//
//    var statesMachine = new StatesMachine(
//        // condition
//        function(){ return data.page && data.project; },
//        // callback
//        function(){ renderView(); });
//
//    repo.projects.getFromName(req.params.name, imageFolder, function(project){
//        statesMachine.tryCallback(function(){
//            data.project = project;
//        });
//    }, renderErrorView);
//
//    repo.pages.getFromName(name, function(page){
//        statesMachine.tryCallback(function(){
//            data.page = page;
//        });
//    }, renderErrorView);

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
