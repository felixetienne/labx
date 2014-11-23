// Objects
var Context = require('../objects/Context');

// Modules
var viewsMap = require('./viewsMap');
var servicesFactory = require('./factories/servicesFactory');

// Instances
var context = new Context();
var page404 = viewsMap.getNotFound();

exports.index = function(req, res){

    context
    .setCurrentRequest(req)
    .setCurrentView(viewsMap.getDefault());

    servicesFactory
    .createPageService(context)
    .getData(
        function(data){ res.render(context.getCurrentView(), data); },
        function(){ res.render(page404); });
};

exports.about = function(req, res){

    context
    .setCurrentRequest(req)
    .setCurrentView(viewsMap.getAbout());

    servicesFactory
    .createPageService(context)
    .getData(
        function(data){ res.render(context.getCurrentView(), data); },
        function(){ res.render(page404); });
};

exports.contact = function(req, res){

    context
    .setCurrentRequest(req)
    .setCurrentView(viewsMap.getContact());

    servicesFactory
    .createPageService(context)
    .getData(
        function(data){ res.render(context.getCurrentView(), data); },
        function(){ res.render(page404); });
};

exports.project = function(req, res){

    context
    .setCurrentRequest(req)
    .setCurrentView(viewsMap.getProject());

    servicesFactory
    .createPageService(context)
    .getData(
        function(data){ res.render(context.getCurrentView(), data); },
        function(){ res.render(page404); });
};
