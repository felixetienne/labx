(function() {

  if (!global.staticServicesFactory) {

    global.staticServicesFactory = (function(mod, viewHelpers,
      SimpleViewService,
      EventViewService, EventsViewService, ProjectViewService,
      ProjectCategoryViewService, ProjectCategoriesViewService) {

      mod.createPageService = function(context, argsObj) {

        if (argsObj.isProjectCategoryPage)
          return new ProjectCategoryViewService(context);

        if (argsObj.isProjectPage)
          return new ProjectViewService(context);

        if (argsObj.isEventPage)
          return new EventViewService(context);

        var page = context.getCurrentPage();

        if (page === viewHelpers.getProjectsPage())
          return new ProjectCategoriesViewService(context);

        if (page === viewHelpers.getEventsPage())
          return new EventsViewService(context);

        return new SimpleViewService(context);
      };

      return mod;

    })({},
      require('../viewHelpers'),
      require('../../classes/services/SimpleViewService'),
      require('../../classes/services/EventViewService'),
      require('../../classes/services/EventsViewService'),
      require('../../classes/services/ProjectViewService'),
      require('../../classes/services/ProjectCategoryViewService'),
      require('../../classes/services/ProjectCategoriesViewService'));
  }

  module.exports = global.staticServicesFactory;

})();
