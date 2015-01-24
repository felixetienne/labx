(function(bricks, BaseRepository, Error) {

  module.exports = function() {
    var _base = new BaseRepository();

    this.getErrors = function() {
      return _base.getErrors();
    }

    this.getProjectByName = function(client, options, action, emptyAction) {

      var query = bricks
        .select(
          '\
            projects.id, \
            projects.name, \
						projects.title, \
            projects.title_short, \
						projects.description_html, \
            projects.description_short, \
            projects.doc_description, \
            projects.doc_keywords, \
            projects.doc_title, \
            projects.keywords, \
            projects.date, \
            projects.sorting, \
            project_categories.name as category_name, \
            project_categories.title as category_title, \
            project_categories.title_short as category_title_short, \
            project_categories.keywords as category_keywords, \
            project_categories.sorting as category_sorting, \
            get_project_image_list(projects.id, \'standard\') as image_list, \
            get_project_media_list(projects.id) as media_list'
        )
        .from('projects')
        .join('project_categories', {
          'projects.category_id': 'project_categories.id'
        });

      if (options.publishedOnly) {
        query = query
          .where('projects.published', true)
          .where('project_categories.published', true);
      }

      query = query
        .where('projects.active', true)
        .where('project_categories.active', true)
        .where('projects.name', options.projectName)
        .orderBy(
          'projects.sorting ASC',
          'category_sorting ASC'
        )
        .limit(1)
        .toString();

      _base.executeQuery(client, query, emptyAction, function(res) {
        var data = res.rows[0];

        data.images = _base.extractMedias(
          data.image_list, true);
        data.medias = _base.extractMedias(
          data.media_list, false);

        action(data);
      });
    }

    this.getFeaturedProjects = function(client, options, action,
      emptyAction) {

      var query = bricks
        .select(
          '\
            projects.id, \
            projects.name, \
            projects.title, \
            projects.title_short, \
            projects.description_short, \
            projects.sorting as project_sorting, \
            project_categories.sorting as project_category_sorting'
        )
        .from('featured_projects')
        .leftJoin('projects', {
          'projects.id': 'featured_projects.project_id'
        })
        .leftJoin('project_categories', {
          'projects.category_id': 'project_categories.id'
        });

      if (options.publishedOnly) {
        query = query
          .where('featured_projects.published', true)
          .where('projects.published', true)
          .where('project_categories.published', true);
      }

      query = query
        .where('featured_projects.active', true)
        .where('projects.active', true)
        .where('project_categories.active', true)
        .toString();

      if (options.excludedProjectName) {
        query +=
          " AND projects.name <> '" + options.excludedProjectName + "'";
      }

      query +=
        '\
          ORDER BY \
          featured_projects.sorting ASC, \
          project_sorting ASC, \
          project_category_sorting ASC';

      _base.executeQuery(client, query, emptyAction, function(res) {
        var data = [];

        res.rows.forEach(function(row) {
          data.push(row);
        });

        action(data);
      });
    }
  }

})(
  require('sql-bricks-postgres'),
  require('./BaseRepository'),
  require('../Error'));
