// Objects
var SimplePageService = require('../../classes/services/SimplePageService');
var ProjectPageService = require('../../classes/services/ProjectPageService');

module.exports = (function(mod, repositoriesFactory, viewsMap){

    mod.createPageService = function(context){
        var view = context.getCurrentView();

        if(view == viewsMap.getProject()) return new ProjectPageService(context, repositoriesFactory);

        return new SimplePageService(context, repositoriesFactory);
    };

    return mod;

})({}, require('./repositoriesFactory'), require('../viewsMap'));
