(function() {

  if (!global.staticWebsiteHelpers) {

    global.staticWebsiteHelpers = (function(mod) {
      var _websiteNames = {
        main: 'labx'
      };

      mod.getWebsiteName = function(key) {
        var websiteName = _websiteNames.hasOwnProperty(key) ?
          _websiteNames[key] : null;

        return websiteName;
      }

      return mod;

    })({});
  }

  module.exports = global.staticWebsiteHelpers;

})();
