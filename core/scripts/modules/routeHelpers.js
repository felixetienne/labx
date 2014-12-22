(function(Context, ModelMetaData, Error) {

  module.exports = (function(mod, servicesFactory, viewHelpers) {

    mod.getRoute = function(pageName) {
      var f = function(req, res) {
        var context = new Context()
          .setCurrentRequest(req)
          .setCurrentPage(pageName);

        servicesFactory
          .createPageService(context)
          .getData(
            function(x, c) {
              x.meta = new ModelMetaData();
              console.log(x);
              res.render(getViewPath(c), x);
            },
            function(e, c) {
              res.render(viewHelpers.getErrorPage(), {
                meta: new ModelMetaData(e)
              });
            });
      }

      return f;
    }

    function getViewPath(context) {
      var page = context.getCurrentPage();
      return viewHelpers.getView(page);
    }

    return mod;

  })({},
    require('./factories/servicesFactory'),
    require('./viewHelpers'));

})(
  require('../classes/Context'),
  require('../classes/ModelMetaData'),
  require('../classes/Error'));
