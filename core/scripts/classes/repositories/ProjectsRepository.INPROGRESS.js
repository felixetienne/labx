(function(q, BaseRepository) {

  module.exports = function(pg, bricks, config) {
    var _base = new BaseRepository(pg, config);

    this.getProjectByName = function(projectName, imageFolder, action,
      emptyAction) {
      if (_base.isInvalidAction(action)) return;

      _base.open(function(client) {

        processQuery(client, projectName, imageFolder)
          .then(completeQuery)
          .then(action)
          .fail(errorAction)
          .done();
      });
    }

    function processQuery(client, projectName, imageFolder) {
      var deferred = q.defer();

      var query = bricks
        .select(
          '\
          projects.title, \
          projects.title_short, \
          projects.description, \
          projects.description_short, \
          projects.name, \
          images.title as image_title, \
          images.id as image_id, \
          images.name as image_name'
        )
        .from('projects')
        .join('project_images', {
          'projects.id': 'project_images.project_id'
        })
        .join('images', {
          'project_images.image_id': 'images.id'
        })
        .where('images.active', true)
        .where('projects.active', true)
        .where('projects.name', projectName)
        .limit(1)
        .toString();

      client
        .query(query, function(err, res) {
          if (err) {
            deferred.reject(err);
          } else {
            deferred.resolve([res, imageFolder]);
          }
          _base.close(client);
        });

      return deferred.promise;
    }

    function completeQuery(args) {
      var res = args[0];
      var imageFolder = args[1];

      if (res.rows) return;

      var data = res.rows[0];

      data.image_path = imageFolder + data.image_name + '.jpg';

      return data;
    }

    function processImageQuery() {
      var deferred = q.defer();

      _base.open(function(client) {

        var query =
          bricks
          .select("images.image as image_raw")
          .from('images')
          .where('images.id', data.image_id)
          .where('images.active', true)
          .toString();

        client
          .query(query, function(err, res) {
            if (err) {
              deferred.reject(err);
            } else {
              deferred.resolve(res);
            }
            _base.close(client);
          });
      });

      console.log('[INFO:repositories:projects.getFromName] Image ' +
        data.image_path + ' does not exists on disk.');

      return deferred.promise;
    }

    function errorAction(err) {
      throw err;
    }
  }
})(require('q'),
  require('./BaseRepository'));
