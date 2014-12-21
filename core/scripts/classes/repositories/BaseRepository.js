(function(ImageManager) {

  module.exports = function(pg, config) {
    var _fullDatabaseUrl = config.getDatabaseUrl() + "?ssl=true";
    var _errors = [];

    this.imageManager = new ImageManager();

    this.isInvalidAction = function(action) {
      if (!action) throw "[ERROR:Dal:getAll] 'action' parameter is null.";
      if (typeof(action) !== "function") throw "[ERROR] The argument 'action' parameter is not a function.";
      return false;
    }

    this.hasResults = function(res) {
      return res && res.rows && res.rowCount > 0;
    }

    this.open = function(callback) {
      pg.connect(_fullDatabaseUrl, function(err, client) {
        if (err) throw "[ERROR:pg:connect] " + err;
        if (!client) throw "[ERROR:dal:pages:getAll] the parameter 'client' is null";
        callback(client);
      });
    }

    this.getErrors = function() {
      return _errors;
    }

    this.addError = function(error) {
      _errors.push(error);
    }

    this.close = function(client) {
      client.end();
    }
  }

})(require('../ImageManager'));
