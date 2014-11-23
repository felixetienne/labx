module.exports = (function(mod){

    var _notFound = '404';
    var _default = 'index';
    var _contact = 'contact';
    var _about = 'about';
    var _project = 'project';

    mod.getNotFound = function(){ return _notFound; }
    mod.getDefault = function(){ return _default; };
    mod.getContact = function(){ return _contact; };
    mod.getAbout = function(){ return _about; };
    mod.getProject = function(){ return _project; };

    return mod;

})({})
