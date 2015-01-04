(function(PagesRepository, EventsRepository, ProjectsRepository,
  ProjectCategoriesRepository, WebsitesRepository, ImagesRepository) {

  module.exports = (function(mod, config, pg, bricks) {

    mod.createPagesRepository = function() {
      return new PagesRepository(config, pg, bricks);
    }

    mod.createEventsRepository = function() {
      return new EventsRepository(config, pg, bricks);
    }

    mod.createProjectsRepository = function() {
      return new ProjectsRepository(config, pg, bricks);
    }

    mod.createProjectCategoriesRepository = function() {
      return new ProjectCategoriesRepository(config, pg, bricks);
    }

    mod.createWebsitesRepository = function() {
      return new WebsitesRepository(config, pg, bricks);
    }

    mod.createImagesRepository = function() {
      return new ImagesRepository(config, pg, bricks);
    }

    return mod;

  })({},
    require('../appConfig'),
    require('pg'),
    require('sql-bricks-postgres'));

})(
  require('../../classes/repositories/PagesRepository'),
  require('../../classes/repositories/EventsRepository'),
  require('../../classes/repositories/ProjectsRepository'),
  require('../../classes/repositories/ProjectCategoriesRepository'),
  require('../../classes/repositories/WebsitesRepository'),
  require('../../classes/repositories/ImagesRepository'));
