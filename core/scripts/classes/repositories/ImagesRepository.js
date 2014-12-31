(function(BaseRepository, Error) {

  module.exports = function(pg, bricks, config) {
    var _base = new BaseRepository(pg, config);
    var _imageFolder = config.getImageFolder();

    this.getErrors = function() {
      return _base.getErrors();
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
            images.sorting'
          );

        if (includeRawData) {
          query = query.select('images.image as raw');
        }

        query = query
          .from('images')
          .where('images.active', true)
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
        var obj = res.rows[i];

        obj.path = _imageFolder + obj.name + '.jpg';

        data.push(obj);
      }

      return data;
    }
  }

})(
  require('./BaseRepository'),
  require('../Error'));
