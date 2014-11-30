// Objects
var PagesRepository = require('../../classes/repositories/PagesRepository');
var ProjectsRepository = require('../../classes/repositories/ProjectsRepository');

module.exports = (function(mod, pg, bricks, config){

    mod.createPagesRepository = function(){
        return new PagesRepository(pg, bricks, config);
    }

    mod.createProjectsRepository = function(){
        return new ProjectsRepository(pg, bricks, config);
    }

    return mod;

})({}, require('pg'), require('sql-bricks-postgres'), require('../appConfig'));
