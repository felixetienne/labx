(function(q, pg, config, repositoriesFactory, ImageManager, List) {

  require('../../core/scripts/extensions/ObjectExtensions');

  module.exports = (function(mod) {
    var _imageManager = new ImageManager();
    var _repo = repositoriesFactory.createImagesRepository();

    mod.process = function() {
      var totalOfImageProcessed = 0;

      getAllImages()
        .then(getWritesImages)
        .done(doneAction);

      function doneAction() {
        console.info(totalOfImageProcessed + ' images was processed.');
      }

      function getAllImages() {
        var deferred = q.defer();

        pg.connect(config.getFullDatabaseUrl(), function(err, client) {
            if (err || !client) {
              console.error('[ERROR:pg:connect] Error: ' + err +
                ', client: ' + client + '.');
              onComplete(client);
              deferred.reject();
            } else {
              _repo.getAll(client, function(data) {
                var ids = new List();

                data.forEach(function(x) {
                  if (!x.force_deploy && _imageManager.exists(
                      x.path))
                    return;
                  ids.add(x.id);
                });

                onComplete(client);
                deferred.resolve(ids);
              });
            }
          },
          function() {
            deferred.reject();
          });

        return deferred.promise
      }

      function getWritesImages(ids) {
        totalOfImageProcessed = ids.count();

        if (totalOfImageProcessed === 0) return;

        pg.connect(config.getFullDatabaseUrl(), function(err, client) {
          if (err || !client) {
            console.error('[ERROR:pg:connect] ' + err +
              ', client: ' + client + '.');
            onComplete(client);
            deferred.reject();
          } else {

            _repo.getByIds(client, ids, true, function(data) {

              data.forEach(function(x) {
                _imageManager.write(x.path, x.content);
              });

              onComplete(client);
            }, null);
          }
        });
      }

      function onComplete(client) {
        if (client) client.end();
      }
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
