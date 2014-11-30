(function(SimplePageService, ProjectPageService){

    module.exports = (function(mod, repositoriesFactory, viewsMap){

        mod.createPageService = function(context){
            var view = context.getCurrentView();

            if(view == viewsMap.getProject()) return new ProjectPageService(context, repositoriesFactory);

            return new SimplePageService(context, repositoriesFactory);
        };

        return mod;

    })({},
       require('./repositoriesFactory'),
       require('../viewsDef'));

})(require('../../classes/services/SimplePageService'),
   require('../../classes/services/ProjectPageService'));
