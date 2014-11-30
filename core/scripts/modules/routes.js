(function(servicesFactory, viewsDef, Context){

    var context = new Context();
    var pagesRoots = viewsDef.getPagesPath();
    var page404 = pagesRoots + viewsDef.getNotFound();
    var getPagePath = function(context){ return pagesRoots + context.getCurrentView(); }

    module.exports.index = function(req, res){

        context
        .setCurrentRequest(req)
        .setCurrentView(viewsDef.getDefault());

        servicesFactory
        .createPageService(context)
        .getData(
            function(data){ res.render(getPagePath(context), data); },
            function(){ res.render(page404); });
    };

    module.exports.about = function(req, res){

        context
        .setCurrentRequest(req)
        .setCurrentView(viewsDef.getAbout());

        servicesFactory
        .createPageService(context)
        .getData(
            function(data){ res.render(getPagePath(context), data); },
            function(){ res.render(page404); });
    };

    module.exports.contact = function(req, res){

        context
        .setCurrentRequest(req)
        .setCurrentView(viewsDef.getContact());

        servicesFactory
        .createPageService(context)
        .getData(
            function(data){ res.render(getPagePath(context), data); },
            function(){ res.render(page404); });
    };

    module.exports.projects = function(req, res){

        context
        .setCurrentRequest(req)
        .setCurrentView(viewsDef.getContact());

        servicesFactory
        .createPageService(context)
        .getData(
            function(data){ res.render(getPagePath(context), data); },
            function(){ res.render(page404); });
    };

    module.exports.project = function(req, res){

        context
        .setCurrentRequest(req)
        .setCurrentView(viewsDef.getProject());

        servicesFactory
        .createPageService(context)
        .getData(
            function(data){ res.render(getPagePath(context), data); },
            function(){ res.render(page404); });
    };

})(require('./factories/servicesFactory'),
   require('./viewsDef'),
   require('../classes/Context'));
