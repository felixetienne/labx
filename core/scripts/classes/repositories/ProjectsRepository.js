(function(BaseRepository) {

  module.exports = function(pg, bricks, config) {
    var _base = new BaseRepository(pg, config);
    var _imageFolder = config.getImageFolder();

    this.getProjectByName = function(projectName, action,
      emptyAction) {
      if (_base.isInvalidAction(action)) return;

      _base.open(function(client) {

        var query = bricks
          .select(
            '\
						projects.title, \
						projects.title_short, \
						projects.description, \
						projects.description_short, \
						projects.name, \
						images.title as image_title, \
						images.name as image_name'
          )
          .from('projects')
          .join('images', {
            'projects.id': 'images.id_project'
          })
          .where('images.active', true)
          .where('projects.active', true)
          .where('projects.name', projectName)
          .groupBy('projects.name')
          .limit(1)
          .toString();

        client
          .query(query, function(err, res) {

            if (err) {
              _base.close(client);
              throw err;
            }

            if (_base.hasResults(res)) {
              var data = res.rows[0];

              data.image_path = _imageFolder + data.image_name +
                '.jpg';

              action(data);
            } else if (typeof emptyAction === 'function') {
              emptyAction();
            }

            _base.close(client);
          });
      });
    }
  }
})(require('./BaseRepository'));
