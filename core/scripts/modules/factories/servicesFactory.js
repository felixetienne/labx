// Objects
var BasicPageService = require('../../objects/services/BasicPageService');
var ProjectPageService = require('../../objects/services/ProjectPageService');

module.exports = (function(mod, repositoriesFactory, viewsMap){

    mod.createPageService = function(context){
        var view = context.getCurrentView();

        if(view == viewsMap.getProject()) return new ProjectPageService(context, repositoriesFactory);

        return new BasicPageService(context, repositoriesFactory);
    };

    return mod;

})({}, require('./repositoriesFactory'), require('../viewsMap'));
