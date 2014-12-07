(function() {

  module.exports = (function(mod) {

    var _imageFolder = '/medias/images/tmp/';
    var _productionType = 'prod';
    var _developmentType = 'dev';
    var _type = process.env.TYPE || _productionType;
    var _databaseUrl = process.env.DATABASE_URL;
    var _port = process.env.PORT;

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

    return mod;

  })({});

})();
