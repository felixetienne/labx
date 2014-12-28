(function(SimplePageService, ProjectPageService, ProjectCategoryPageService) {

  module.exports = (function(mod, repositoriesFactory, viewHelpers) {

    mod.createPageService = function(context, argsObj) {

      if (argsObj.isProjectCategoriesPage)
        return new ProjectCategoryPageService(context,
          repositoriesFactory, viewHelpers);

      if (argsObj.isProjectDetailsPage)
        return new ProjectPageService(context, repositoriesFactory,
          viewHelpers);

      return new SimplePageService(context, repositoriesFactory,
        viewHelpers);
    };

    return mod;

  })({},
    require('./repositoriesFactory'),
    require('../viewHelpers'));

})(
  require('../../classes/services/SimplePageService'),
  require('../../classes/services/ProjectPageService'),
  require('../../classes/services/ProjectCategoryPageService'));
