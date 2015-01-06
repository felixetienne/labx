(function() {

  if (!global.staticRouteHelpers) {

    global.staticRouteHelpers = (function(mod, servicesFactory,
      websiteHelpers, viewHelpers, layoutHelpers,
      Context, ViewMetaData, Error) {

      mod.getRouteCallback = function(pageName, argsObj) {
        var argsObj = argsObj || {};
        var websiteName = websiteHelpers.getWebsiteName('main');
        var callback = function(req, res) {
          var context = new Context()
            .setCurrentRequest(req)
            .setCurrentPage(pageName)
            .setCurrentWebsite(websiteName);

          servicesFactory
            .createPageService(context, argsObj)
            .getData(
              function(x, c, e) {
                var view = getViewPath(c, argsObj);
                var layout = getViewLayout(c);
                x.meta = new ViewMetaData().setLayout(layout);
                // DEBUG ///////////////////////////////////////
                // console.log('\n\n===== DEBUG =====\n');
                // console.log(
                //   'View: ' + view + ' ("' + layout + '" layout).\n');
                // console.log(x);
                // console.log('\n=================\n\n');
                ////////////////////////////////////////////////
                logErrors(e);
                res.render(view, x);
              },
              function(c, e) {
                var view = viewHelpers.getErrorPage();
                logErrors(e);
                res.render(view, {
                  meta: new ViewMetaData(e).asErrorPage()
                });
              });
        }

        return callback;
      }

      function logErrors(errors) {
        for (var i = 0; i < errors.length; i++) {
          errors[i].print();
        }
      }

      function getViewLayout(context) {
        var layout = viewHelpers.getLayout(context.getCurrentPage());

        return layout;
      }

      function getViewPath(context, argsObj) {
        var page;

        if (argsObj.isProjectCategoryPage) {
          page = 'projectCategory';
        } else {
          page = context.getCurrentPage();
        }

        return viewHelpers.getView(page);
      }

      return mod;

    })({},
      require('./factories/servicesFactory'),
      require('./websiteHelpers'),
      require('./viewHelpers'),
      require('./layoutHelpers'),
      require('../classes/Context'),
      require('../classes/ViewMetaData'),
      require('../classes/Error'));
  }

  module.exports = global.staticRouteHelpers;

})();
