(function(BaseRepository, Error) {

  module.exports = function(pg, bricks, config) {
    var _base = new BaseRepository(pg, config);
    var _imageFolder = config.getImageFolder();

    this.getProjectByName = function(projectName, action,
      emptyAction, isRequired) {
      if (_base.isInvalidAction(action)) return;

      _base.open(function(client) {

        var query = bricks
          .select(
            '\
            projects.id, \
						projects.title, \
						projects.description, \
						projects.name, \
            projects.date, \
            projects.sorting, \
            project_categories.title as category_title, \
            project_categories.sorting as category_sorting, \
						images.title as image_title, \
						images.name as image_name, \
            images.sorting as image_sorting'
          )
          .from('projects')
          .join('images', {
            'projects.id': 'images.id_project'
          })
          .join('project_categories', {
            'projects.category_id': 'project_categories.id'
          })
          .where('images.thumbnail', false)
          .where('images.active', true)
          .where('projects.active', true)
          .where('project_categories.active', true)
          .where('projects.name', projectName)
          .groupBy('projects.id')
          .orderBy('projects.sorting ASC', 'category_sorting ASC',
            'image_sorting ASC')
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
              if (isRequired) {
                emptyAction(new Error('Project not found.', 500));
              } else {
                emptyAction();
              }
            }

            _base.close(client);
          });
      });
    }

  }

})(
  require('./BaseRepository'),
  require('../Error'));
