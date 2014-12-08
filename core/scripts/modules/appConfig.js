(function() {

  module.exports = (function(mod) {

    var _imageFolder = '/medias/images/tmp/';
    var _productionType = 'prod';
    var _developmentType = 'dev';
    var _type, _databaseUrl, _port;

    updateFromEnvFile();

    mod.setEnvFile = function(filePath) {

      throw 'Not implemented exeption.';
      // Required to load 'node-env-file' as envFile.
      //envFile(filePath);

      updateFromEnvFile();

      return this;
    }

    mod.getImageFolder = function() {
      return _imageFolder;
    }
    mod.getDatabaseUrl = function() {
      return _databaseUrl;
    }
    mod.getCurrentPort = function() {
      return _port;
    }
    mod.getCurrentType = function() {
      return _type
    }
    mod.currentTypeIsProduction = function() {
      return _type === _productionType;
    }
    mod.currentTypeIsDevelopment = function() {
      return _type === _developmentType;
    }

    function updateFromEnvFile() {
      _type = process.env.TYPE || _productionType;
      _databaseUrl = process.env.DATABASE_URL;
      _port = process.env.PORT;
    }

    return mod;

  })({});

})();
