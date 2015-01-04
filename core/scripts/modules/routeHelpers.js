(function(Context, ViewMetaData, Error) {

  module.exports = (function(mod, servicesFactory, viewHelpers) {

    mod.getRoute = function(pageName, argsObj) {
      var argsObj = argsObj || {};
      var f = function(req, res) {
        var context = new Context()
          .setCurrentRequest(req)
          .setCurrentPage(pageName);

        servicesFactory
          .createPageService(context, argsObj)
          .getData(
            function(x, c) {
              x.meta = new ViewMetaData().setLayout(getViewLayout(c));
              // console.log('\n\n===== DEBUG =====\n');
              // console.log(x);
              // console.log('\n=================\n\n');
              res.render(getViewPath(c, argsObj), x);
            },
            function(e, c) {
              res.render(viewHelpers.getErrorPage(), {
                meta: new ViewMetaData(e).asErrorPage()
              });
            });
      }

      return f;
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
    require('./viewHelpers'),
    require('./layoutHelpers'));

})(
  require('../classes/Context'),
  require('../classes/ViewMetaData'),
  require('../classes/Error'));
