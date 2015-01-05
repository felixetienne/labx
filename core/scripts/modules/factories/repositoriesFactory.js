(function() {

  if (!global.staticRepositoriesFactory) {

    global.staticRepositoriesFactory = (function(mod,
      PagesRepository, EventsRepository, ProjectsRepository,
      ProjectCategoriesRepository, WebsitesRepository, ImagesRepository) {

      mod.createPagesRepository = function() {
        return new PagesRepository();
      }

      mod.createEventsRepository = function() {
        return new EventsRepository();
      }

      mod.createProjectsRepository = function() {
        return new ProjectsRepository();
      }

      mod.createProjectCategoriesRepository = function() {
        return new ProjectCategoriesRepository();
      }

      mod.createWebsitesRepository = function() {
        return new WebsitesRepository();
      }

      mod.createImagesRepository = function() {
        return new ImagesRepository();
      }

      return mod;

    })({},
      require('../../classes/repositories/PagesRepository'),
      require('../../classes/repositories/EventsRepository'),
      require('../../classes/repositories/ProjectsRepository'),
      require('../../classes/repositories/ProjectCategoriesRepository'),
      require('../../classes/repositories/WebsitesRepository'),
      require('../../classes/repositories/ImagesRepository'));
  }

  module.exports = global.staticRepositoriesFactory;

})();
