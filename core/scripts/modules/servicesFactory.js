var PageService = require('../objects/PageService');
var ProjectPageService = require('../objects/ProjectPageService');

module.exports = (function(mod, repo, viewsMap){

    mod.createPageService = function(context){
        var view = context.getCurrentView();

        if(view == viewsMap.project) return new ProjectPageService(context, repo);

        return new PageService(context, repo);
    };

    return mod;

})({}, require('./repositories'), require('./viewsMap'));
