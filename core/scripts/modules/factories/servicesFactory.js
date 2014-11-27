// Objects
var SimplePageService = require('../../objects/services/SimplePageService');
var ProjectPageService = require('../../objects/services/ProjectPageService');

module.exports = (function(mod, repositoriesFactory, viewsMap){

    mod.createPageService = function(context){
        var view = context.getCurrentView();

        if(view == viewsMap.getProject()) return new ProjectPageService(context, repositoriesFactory);

        return new SimplePageService(context, repositoriesFactory);
    };

    return mod;

})({}, require('./repositoriesFactory'), require('../viewsMap'));
