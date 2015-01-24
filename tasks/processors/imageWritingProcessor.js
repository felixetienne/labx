(function(q, pg, config, repositoriesFactory, ImageManager, List) {

  require('../../core/scripts/extensions/ObjectExtensions');

  module.exports = (function(mod) {
    var _imageManager = new ImageManager();
    var _repo = repositoriesFactory.createImagesRepository();

    mod.process = function() {
      var totalOfImageProcessed = 0;
      var databaseUrl = config.getFullDatabaseUrl();

      pg.connect(databaseUrl, function(err, client, done) {

        getAllImages()
          .then(getWritesImages)
          .then(onComplete)
          .done();

        function getAllImages() {
          var deferred = q.defer();
          var options = getBasicOptions();

          _repo.getAll(client, options,
            function(images) {
              var ids = new List();

              for (var i = 0; i < images.length; i++) {
                var image = images[i];

                if (mustBeDeployed(image)) {
                  ids.add(image.id);
                }
              }

              deferred.resolve(ids);
            },
            function() {
              deferred.reject();
            });

          return deferred.promise;
        }

        function getWritesImages(ids) {
          var deferred = q.defer();

          totalOfImageProcessed = ids.count();

          if (totalOfImageProcessed === 0) {
            deferred.resolve();
            return;
          }

          var options = getBasicOptions();

          options.includeRawData = true;
          options.idsList = ids;

          _repo.getByIds(client, options,
            function(data) {

              data.forEach(function(x) {
                _imageManager.write(x.path, x.content);
              });

              deferred.resolve();
            },
            function() {
              deferred.reject();
            });

          return deferred.promise;
        }

        function onComplete() {
          done();
          console.info(totalOfImageProcessed +
            ' images was processed.');
        }
      });
    }

    function getBasicOptions() {
      var options = {
        publishedOnly: config.currentTypeIsProduction()
      };

      return options;
    }

    function mustBeDeployed(image) {

      if (image.force_deploy) return true;

      return !_imageManager.exists(image.path);
    }

    return mod;

  })({});

})(
  require('q'),
  require('pg'),
  require('../../core/scripts/modules/appConfig'),
  require('../../core/scripts/modules/factories/repositoriesFactory'),
  require('../../core/scripts/classes/ImageManager'),
  require('../../core/scripts/classes/List'));
