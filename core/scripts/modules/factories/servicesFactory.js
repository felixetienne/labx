(function(SimpleViewService, EventViewService, EventsViewService,
  ProjectViewService, ProjectCategoryViewService,
  ProjectCategoriesViewService) {

  module.exports = (function(mod, repositoriesFactory, config, viewHelpers) {

    mod.createPageService = function(context, argsObj) {

      if (argsObj.isProjectCategoryPage)
        return new ProjectCategoryViewService(context, config,
          repositoriesFactory, viewHelpers);

      if (argsObj.isProjectPage)
        return new ProjectViewService(context, config,
          repositoriesFactory, viewHelpers);

      if (argsObj.isEventPage)
        return new EventViewService(context, config,
          repositoriesFactory, viewHelpers);

      var page = context.getCurrentPage();

      if (page === viewHelpers.getProjectsPage())
        return new ProjectCategoriesViewService(context,
          config, repositoriesFactory, viewHelpers);

      if (page === viewHelpers.getEventsPage())
        return new EventsViewService(context,
          config, repositoriesFactory, viewHelpers);

      return new SimpleViewService(context, config,
        repositoriesFactory, viewHelpers);
    };

    return mod;

  })({},
    require('./repositoriesFactory'),
    require('../appConfig'),
    require('../viewHelpers'));

})(
  require('../../classes/services/SimpleViewService'),
  require('../../classes/services/EventViewService'),
  require('../../classes/services/EventsViewService'),
  require('../../classes/services/ProjectViewService'),
  require('../../classes/services/ProjectCategoryViewService'),
  require('../../classes/services/ProjectCategoriesViewService'));
