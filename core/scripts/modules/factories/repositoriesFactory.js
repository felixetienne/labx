(function(PagesRepository, ProjectsRepository, WebsitesRepository,
  ImagesRepository) {

  module.exports = (function(mod, pg, bricks, config) {

    mod.createPagesRepository = function() {
      return new PagesRepository(pg, bricks, config);
    }

    mod.createProjectsRepository = function() {
      return new ProjectsRepository(pg, bricks, config);
    }

    mod.createWebsitesRepository = function() {
      return new WebsitesRepository(pg, bricks, config);
    }

    mod.createImagesRepository = function() {
      return new ImagesRepository(pg, bricks, config);
    }

    return mod;

  })({},
    require('pg'),
    require('sql-bricks-postgres'),
    require('../appConfig'));

})(
  require('../../classes/repositories/PagesRepository'),
  require('../../classes/repositories/ProjectsRepository'),
  require('../../classes/repositories/WebsitesRepository'),
  require('../../classes/repositories/ImagesRepository'));