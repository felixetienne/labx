(function() {

  if (!global.staticWebsiteHelpers) {

    global.staticWebsiteHelpers = (function(mod) {
      var _defaultKey = 'main';
      var _websiteNames = {};

      _websiteNames[_defaultKey] = 'akt';

      mod.getWebsiteName = function(key) {
        var websiteName = null;

        if (!key) {
          websiteName = _websiteNames[_defaultKey];
        } else if (_websiteNames.hasOwnProperty(key)) {
          websiteName = _websiteNames[key];
        }

        return websiteName;
      }

      return mod;

    })({});
  }

  module.exports = global.staticWebsiteHelpers;

})();
