(function(BaseRepository, Error) {

  module.exports = function(pg, bricks, config) {
    var _base = new BaseRepository(pg, config);

    this.getErrors = function() {
      return _base.getErrors();
    }

    this.getBanners = function(action, emptyAction) {
      if (_base.isInvalidAction(action)) return;

      _base.open(function(client) {
        var query = bricks
          .select(
            '\
          banner_images.sorting, \
          images.name, \
          images.title, \
          images.sorting as image_sorting, \
          projects.id as project_id, \
          projects.title as project_title, \
          projects.title_short as project_title_short, \
          projects.description_short as project_description_short, \
          projects.name as project_name, \
          projects.date as project_date, \
          projects.featured as project_featured, \
          projects.sorting as project_sorting, \
          project_categories.id as project_category_id, \
          project_categories.name as project_category_name, \
          project_categories.title as project_category_title, \
          project_categories.title_short as project_category_title_short'
          )
          .from('banner_images')
          .innerJoin('images', {
            'images.id': 'banner_images.image_id'
          })
          .leftJoin('project_images', {
            'project_images.image_id': 'images.id'
          })
          .leftJoin('projects', {
            'projects.id': 'project_images.project_id'
          })
          .leftJoin('project_categories', {
            'project_categories.id': 'projects.category_id'
          })
          .where('images.active', true)
          .toString();

        query +=
          '\
        AND (\
          (projects.active = TRUE AND project_categories.active = TRUE)\
           OR \
          (projects.active IS NULL AND project_categories.active IS NULL)\
        )\
        ORDER BY \
        banner_images.sorting ASC, \
        image_sorting ASC, \
        project_sorting ASC, \
        project_categories.sorting ASC';

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
                row.path = _base.buildImagePath(row);
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

    this.getAll = function(action, emptyAction) {
      if (_base.isInvalidAction(action)) return;

      _base.open(function(client) {
        var query = bricks
          .select(
            '\
          images.title, \
          images.name, \
          images.id, \
          images.force_deploy, \
          images.sorting'
          )
          .from('images')
          .where('images.active', true)
          .where(bricks.isNotNull('images.content'))
          .orderBy('images.sorting ASC')
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
              action(convertToData(res));
            } else {
              emptyAction();
            }

            _base.close(client);
          });
      });
    }

    this.getByIds = function(idsList, includeRawData, action, emptyAction) {
      if (_base.isInvalidAction(action)) return;

      _base.open(function(client) {
        var query = bricks
          .select(
            '\
          images.name, \
          images.sorting');

        if (includeRawData) {
          query = query.select('images.content');
        }

        query = query
          .from('images')
          .where('images.active', true)
          .where(bricks.isNotNull('images.content'))
          .toString();

        var last = idsList.count() - 1;

        idsList.do(function(x, i) {
          query += (
            i === 0 ? ' AND (' : ' OR '
          ) + 'images.id = ' + x;
          if (i === last) query += ')';
        });

        query += 'ORDER BY images.sorting ASC'

        client
          .query(query, function(err, res) {

            if (err) {
              _base.close(client);
              _base.addError(new Error(err, 500));
              emptyAction();
              return;
            }

            if (_base.hasResults(res)) {
              action(convertToData(res));
            } else if (typeof emptyAction === 'function') {
              emptyAction();
            }

            _base.close(client);
          });
      });
    }

    function convertToData(res) {
      var data = [];

      for (var i = 0; i < res.rowCount; i++) {
        var image = res.rows[i];

        image.path = _base.buildImagePath(image);

        data.push(image);
      }

      return data;
    }
  }

})(
  require('./BaseRepository'),
  require('../Error'));
