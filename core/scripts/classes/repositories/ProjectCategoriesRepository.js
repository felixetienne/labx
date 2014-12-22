(function(BaseRepository, Error) {

  module.exports = function(pg, bricks, config) {
    var _base = new BaseRepository(pg, config);
    var _imageFolder = config.getImageFolder();

    this.getProjectCategories = function(action, emptyAction, isRequired) {
      if (_base.isInvalidAction(action)) return;

      _base.open(function(client) {

        var query = bricks
          .select(
            '\
            project_categories.id, \
            project_categories.title, \
            project_categories.sorting, \
            projects.id as project_id, \
            projects.title_short as project_title_short, \
            projects.description_short as project_description_short, \
            projects.name as project_name, \
            projects.date as project_date, \
            projects.sorting as project_sorting, \
            images.title as image_title, \
            images.name as image_name, \
            images.shorting as image_sorting'
          )
          .from('project_categories')
          .join('projects', {
            'project_categories.id': 'projects.id'
          })
          .join('images', {
            'projects.id': 'images.id_project'
          })
          .where('images.thumbnail', true)
          .where('images.active', true)
          .where('projects.active', true)
          .where('project_categories.active', true)
          .where('projects.name', projectName)
          //.groupBy('project_categories.id', 'projects.id')
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
                emptyAction(new Error(
                  'Project categories not found.', 500));
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
