(function() {

  if (!global.staticAppConfig) {

    global.staticAppConfig = (function(mod) {
      var _imageFolder = '/medias/images/tmp/';
      var _productionType = 'prod';
      var _developmentType = 'dev';
      var _dateFormat = 'dd/mm/yyyy';
      var _maximumEventsInMenu = 10;
      var _maximumLastEvents = 3;
      var _type, _port, _databaseUrl, _fullDatabaseUrl;

      updateFromEnvFile();

      var _cacheSettings = currentTypeIsProduction() ? {
        stdTTL: 120, // seconds (ex.: 90)
        checkperiod: 180 // seconds (ex.: 120)
      } : {
        stdTTL: 2, // seconds (ex.: 90)
        checkperiod: 3 // seconds (ex.: 120)
      };

      mod.setEnvFile = function(filePath) {

        throw 'Not implemented exeption.';

        updateFromEnvFile();

        return this;
      }
      mod.getWebsiteNames = function() {
        return _websiteNames;
      }
      mod.getDateFormat = function() {
        return _dateFormat;
      }
      mod.getCacheSettings = function() {
        return _cacheSettings;
      }
      mod.getMaximumEventsInMenu = function() {
        return _maximumEventsInMenu;
      }
      mod.getMaximumLastEvents = function() {
        return _maximumLastEvents;
      }
      mod.getImageFolder = function() {
        return _imageFolder;
      }
      mod.getDatabaseUrl = function() {
        return _databaseUrl;
      }
      mod.getFullDatabaseUrl = function() {
        return _fullDatabaseUrl;
      }
      mod.getCurrentPort = function() {
        return _port;
      }
      mod.getCurrentType = function() {
        return _type
      }

      mod.currentTypeIsProduction = currentTypeIsProduction;
      mod.currentTypeIsDevelopment = currentTypeIsDevelopment;

      function currentTypeIsProduction() {
        return _type === _productionType;
      }

      function currentTypeIsDevelopment() {
        return _type === _developmentType;
      }

      function updateFromEnvFile() {
        _type = process.env.TYPE || _productionType;
        _port = process.env.PORT;
        _databaseUrl = process.env.DATABASE_URL;
        _fullDatabaseUrl = _databaseUrl + "?ssl=true";
      }

      return mod;

    })({});
  }

  module.exports = global.staticAppConfig;

})();
