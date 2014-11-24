var ImageManager = require('../ImageManager');

module.exports = function BaseRepository(pg, config){

    var _fullDatabaseUrl = config.getDatabaseUrl() + "?ssl=true";

    this.imageManager = new ImageManager();

    this.isInvalidAction = function(action){
        if(!action) throw "[ERROR:Dal:getAll] 'action' parameter is null.";
        if(typeof(action) != "function") throw "[ERROR:Dal:getAll] 'action' parameter is not a function.";
        return false;
    };

    this.hasResults = function(res, emptyAction){
        if(typeof(res) != 'undefined' &&
           typeof(res.rows) != 'undefined' &&
           res.rowCount > 0) return true;
        if(typeof(emptyAction) == 'function') emptyAction();
        return false;
    };

    this.open = function(callback){
        pg.connect(_fullDatabaseUrl, function(err, client) {
            if(err) throw "[ERROR:pg:connect] " + err;
            if(!client) throw "[ERROR:dal:pages:getAll] the parameter 'client' is null";
            callback(client);
        });
    };

    this.close = function(client){ client.end(); }
}
