(function(SimplePageService, ProjectPageService) {

  module.exports = (function(mod, repositoriesFactory, viewHelpers) {

    mod.createPageService = function(context) {
      var view = context.getCurrentPage();

      switch (view) {
        case viewHelpers.getProjectPage():
          return new ProjectPageService(context, repositoriesFactory,
            viewHelpers);
        default:
          return new SimplePageService(context, repositoriesFactory,
            viewHelpers);
      }
    };

    return mod;

  })({},
    require('./repositoriesFactory'),
    require('../viewHelpers'));

})(require('../../classes/services/SimplePageService'),
  require('../../classes/services/ProjectPageService'));
