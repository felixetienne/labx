(function(servicesFactory, viewsDef, Context) {
  var context = new Context();
  var pagesRoots = viewsDef.getPagesPath();
  var page404 = viewsDef.getNotFound();

  module.exports.index = function(req, res) {

    context
      .setCurrentRequest(req)
      .setCurrentView(viewsDef.getDefault());

    servicesFactory
      .createPageService(context)
      .getData(
        function(x, c) {
          res.render(getPagePath(c), x);
        },
        function(c) {
          res.render(page404);
        });
  };

  module.exports.about = function(req, res) {

    context
      .setCurrentRequest(req)
      .setCurrentView(viewsDef.getAbout());

    servicesFactory
      .createPageService(context)
      .getData(
        function(x, c) {
          res.render(getPagePath(c), x);
        },
        function(c) {
          res.render(page404);
        });
  };

  module.exports.contact = function(req, res) {

    context
      .setCurrentRequest(req)
      .setCurrentView(viewsDef.getContact());

    servicesFactory
      .createPageService(context)
      .getData(
        function(x, c) {
          res.render(getPagePath(c), x);
        },
        function(c) {
          res.render(page404);
        });
  };

  module.exports.projects = function(req, res) {

    context
      .setCurrentRequest(req)
      .setCurrentView(viewsDef.getContact());

    servicesFactory
      .createPageService(context)
      .getData(
        function(x, c) {
          res.render(getPagePath(c), x);
        },
        function(c) {
          res.render(page404);
        });
  };

  module.exports.project = function(req, res) {

    context
      .setCurrentRequest(req)
      .setCurrentView(viewsDef.getProject());

    servicesFactory
      .createPageService(context)
      .getData(
        function(data, currentContext) {
          res.render(getPagePath(currentContext), data);
        },
        function() {
          res.render(page404);
        });
  };

  function getPagePath(context) {
    var path = context.getCurrentView();
    return path;
  }

})(
  require('./factories/servicesFactory'),
  require('./viewsDef'),
  require('../classes/Context'));
