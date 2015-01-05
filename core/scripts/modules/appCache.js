(function() {

  if (!global.staticAppCache) {

    global.staticAppCache = (function(config, Cache) {
      var cache = new Cache(config.getCacheSettings());

      return cache;

    })(
      require('./appConfig'),
      require('node-cache'));
  }

  module.exports = global.staticAppCache;

})();
