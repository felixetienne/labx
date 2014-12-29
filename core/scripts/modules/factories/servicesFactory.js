(function(SimpleViewService, ProjectViewService, ProjectCategoryViewService,
  ProjectCategoriesViewService) {

  module.exports = (function(mod, repositoriesFactory, viewHelpers) {

    mod.createPageService = function(context, argsObj) {

      if (argsObj.isProjectCategoryPage)
        return new ProjectCategoryViewService(context,
          repositoriesFactory, viewHelpers);

      if (argsObj.isProjectPage)
        return new ProjectViewService(context, repositoriesFactory,
          viewHelpers);

      var page = context.getCurrentPage();

      if (page === viewHelpers.getProjectsPage())
        return new ProjectCategoriesViewService(context,
          repositoriesFactory, viewHelpers);

      return new SimpleViewService(context, repositoriesFactory,
        viewHelpers);
    };

    return mod;

  })({},
    require('./repositoriesFactory'),
    require('../viewHelpers'));

})(
  require('../../classes/services/SimpleViewService'),
  require('../../classes/services/ProjectViewService'),
  require('../../classes/services/ProjectCategoryViewService'),
  require('../../classes/services/ProjectCategoriesViewService'));
