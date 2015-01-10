(function() {

  if (!global.staticRouteHelpers) {

    global.staticRouteHelpers = (function(mod, servicesFactory, config,
      websiteHelpers, viewHelpers, layoutHelpers,
      Context, ViewMetaData, Error) {

      mod.getRouteCallback = function(pageName, argsObj) {
        var argsObj = argsObj || {};

        return function(req, res) {
          var websiteName = websiteHelpers.getWebsiteName();
          var currentContext = new Context()
            .setCurrentRequest(req)
            .setCurrentPage(pageName)
            .setCurrentWebsite(websiteName);

          servicesFactory
            .createPageService(currentContext, argsObj)
            .getData(
              function(data, context, errors) {
                var view = getViewPath(context, argsObj);
                var layout = getViewLayout(context);

                data.meta = new ViewMetaData().setLayout(layout);

                // DEBUG \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                // console.log('\n\n===== DEBUG =====\n');
                // console.log(
                //   'View: ' + view + ' ("' + layout + '" layout).\n'
                // );
                // console.log(data);
                // console.log('\n=================\n\n');
                ///////////////////////////////////////////////////

                res.render(view, data);
                logErrors(errors);
              },
              function(context, errors) {
                var view = viewHelpers.getErrorPage();
                var data = {
                  meta: new ViewMetaData(errors).asErrorPage()
                };

                res.render(view, data);
                logErrors(errors);
              });
        }
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
      require('./appConfig'),
      require('./websiteHelpers'),
      require('./viewHelpers'),
      require('./layoutHelpers'),
      require('../classes/Context'),
      require('../classes/ViewMetaData'),
      require('../classes/Error'));
  }

  module.exports = global.staticRouteHelpers;

})();
