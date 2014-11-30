module.exports = (function(mod){

    var _serverErreor = 'pages/500';
    var _notFound = 'pages/404';
    var _default = 'pages/index';
    var _contact = 'pages/contact';
    var _about = 'pages/about';
    var _project = 'pages/project';
    var _projectS = 'pages/projects';

    mod.getNotFound = function(){ return _notFound; }
    mod.getDefault = function(){ return _default; };
    mod.getContact = function(){ return _contact; };
    mod.getAbout = function(){ return _about; };
    mod.getProjects = function(){ return _projects; };
    mod.getProject = function(){ return _project; };

    return mod;

})({})
