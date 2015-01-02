(function(BaseRepository, Error) {

  module.exports = function(pg, bricks, config) {
    var _base = new BaseRepository(pg, config);
    var _imageFolder = config.getImageFolder();

    this.getErrors = function() {
      return _base.getErrors();
    }

    this.getProjectCategoryByName = function(projectCategoryName, action,
      emptyAction) {
      if (_base.isInvalidAction(action)) return;

      _base.open(function(client) {
        var query = bricks
          .select(
            '\
            project_categories.id, \
            project_categories.title, \
            project_categories.description_html, \
            project_categories.description_short, \
            project_categories.doc_description, \
            project_categories.doc_keywords, \
            project_categories.doc_title, \
            project_categories.keywords, \
            projects.id as project_id, \
            projects.title as project_title, \
            projects.title_short as project_title_short, \
            projects.description_short as project_description_short, \
            projects.name as project_name, \
            projects.date as project_date, \
            projects.sorting as project_sorting, \
            get_project_image_list(projects.id, TRUE) as project_image_list'
          )
          .from('project_categories')
          .leftJoin('projects', {
            'project_categories.id': 'projects.category_id'
          })
          .where('project_categories.name', projectCategoryName)
          .where('project_categories.active', true)
          .where('projects.active', true)
          .orderBy(
            'project_categories.sorting ASC',
            'project_sorting ASC'
          )
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
              var data = [];

              res.rows.forEach(function(row) {

                row.project_images = _base.extractMedias(
                  row.project_image_list, true);

                data.push(row);
              });

              action(data);
            } else if (typeof emptyAction === 'function') {
              emptyAction();
            }

            _base.close(client);
          });
      });
    }

    this.getAllProjectCategories = function(action,
      emptyAction) {
      if (_base.isInvalidAction(action)) return;

      _base.open(function(client) {
        var query = bricks
          .select(
            '\
            project_categories.id, \
            project_categories.name, \
            project_categories.title, \
            project_categories.title_short, \
            project_categories.description_short, \
            projects.id as project_id, \
            projects.title as project_title, \
            projects.title_short as project_title_short, \
            projects.description_short as project_description_short, \
            projects.name as project_name, \
            projects.date as project_date, \
            projects.sorting as project_sorting, \
            get_project_image_list(projects.id, TRUE) as project_image_list'
          )
          .from('project_categories')
          .leftJoin('projects', {
            'project_categories.id': 'projects.category_id'
          })
          .where('project_categories.active', true)
          .where('projects.active', true)
          .orderBy(
            'project_categories.sorting ASC',
            'project_sorting ASC'
          )
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
              var data = [];

              res.rows.forEach(function(row) {

                row.project_images = _base.extractMedias(
                  row.project_image_list, true);

                data.push(row);
              });

              action(data);
            } else if (typeof emptyAction === 'function') {
              emptyAction();
            }

            _base.close(client);
          });
      });
    }

    this.getMenuProjectCategories = function(action, emptyAction) {
      if (_base.isInvalidAction(action)) return;

      _base.open(function(client) {
        var query = bricks
          .select(
            '\
            project_categories.id, \
            project_categories.name, \
            project_categories.title, \
            project_categories.title_short, \
            project_categories.sorting'
          )
          .from('project_categories')
          .where('project_categories.active', true)
          .orderBy('project_categories.sorting ASC')
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
              var data = [];

              res.rows.forEach(function(row) {
                data.push(row);
              });

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
