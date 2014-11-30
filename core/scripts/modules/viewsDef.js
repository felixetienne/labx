(function(){

    module.exports = (function(mod){

        var _pagesPath = 'pages/';

        var _serverErreor = '500';
        var _notFound = '404';
        var _default = 'index';
        var _contact = 'contact';
        var _about = 'about';
        var _project = 'project';
        var _projectS = 'projects';

        mod.getPagesPath = function(){ return _pagesPath; }

        mod.getNotFound = function(){ return _notFound; }
        mod.getDefault = function(){ return _default; };
        mod.getContact = function(){ return _contact; };
        mod.getAbout = function(){ return _about; };
        mod.getProjects = function(){ return _projects; };
        mod.getProject = function(){ return _project; };

        return mod;

    })({});

})();
