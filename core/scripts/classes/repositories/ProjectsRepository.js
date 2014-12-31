(function(BaseRepository, Error) {

  module.exports = function(pg, bricks, config) {
    var _base = new BaseRepository(pg, config);

    this.getErrors = function() {
      return _base.getErrors();
    }

    this.getProjectByName = function(projectName, action,
      emptyAction) {
      if (_base.isInvalidAction(action)) return;

      _base.open(function(client) {
        var query = bricks
          .select(
            '\
            projects.id, \
						projects.title, \
						projects.description_html, \
            projects.description_short, \
            projects.doc_description, \
            projects.doc_keywords, \
            projects.doc_title, \
            projects.keywords, \
						projects.name, \
            projects.date, \
            projects.sorting, \
            project_categories.title as category_title, \
            project_categories.keywords as category_keywords, \
            project_categories.sorting as category_sorting, \
            get_project_image_list(projects.id, FALSE) as image_list'
          )
          .from('projects')
          .join('project_categories', {
            'projects.category_id': 'project_categories.id'
          })
          .where('projects.active', true)
          .where('project_categories.active', true)
          .where('projects.name', projectName)
          .orderBy(
            'projects.sorting ASC',
            'category_sorting ASC'
          )
          .limit(1)
          .toString();

        client
          .query(query, function(err, res) {

            if (err) {
              _base.close(client);
              _base.addError(new Error(err, 500));
              emptyAction();
              return;
            }

            if (_base.hasResults(res)) {
              var data = res.rows[0];

              data.images = _base.extractImages(data.image_list);

              for (var i = 0; i < data.images.length; i++) {
                data.images[i].path = _base.buildImagePath(
                  data.images[i].name);
              }

              action(data);
            } else if (typeof emptyAction === 'function') {
              emptyAction();
            }

            _base.close(client);
          });
      });
    }
  }

})(
  require('./BaseRepository'),
  require('../Error'));
