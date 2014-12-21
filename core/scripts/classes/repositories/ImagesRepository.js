(function(BaseRepository, Error) {

  module.exports = function(pg, bricks, config) {
    var _base = new BaseRepository(pg, config);
    var _imageFolder = config.getImageFolder();

    this.getAll = function(action, emptyAction, isRequired) {
      if (_base.isInvalidAction(action)) return;

      _base.open(function(client) {

        var query = bricks
          .select(
            '\
          images.title, \
          images.name, \
          images.id'
          )
          .from('images')
          .where('images.active', true)
          .toString();

        client
          .query(query, function(err, res) {

            if (err) {
              _base.close(client);
              throw err;
            }

            if (_base.hasResults(res)) {
              action(convertToData(res));
            } else {
              if (isRequired) {
                emptyAction(new Error('Images not found.', 500));
              } else {
                emptyAction();
              }
            }

            _base.close(client);
          });
      });
    }

    this.getByIds = function(idsList, includeRawData, action, emptyAction,
      isRequired) {
      if (_base.isInvalidAction(action)) return;

      _base.open(function(client) {

        var query = bricks.select('images.name');

        if (includeRawData) {
          query = query.select('images.image as raw');
        }

        query = query
          .from('images')
          .where('images.active', true)
          .toString();

        var last = idsList.count() - 1;

        idsList.do(function(x, i) {
          query += (i == 0 ? ' AND (' : ' OR ') + 'images.id = ' +
            x;
          if (i == last) query += ')';
        });

        client
          .query(query, function(err, res) {

            if (err) {
              _base.close(client);
              throw err;
            }

            if (_base.hasResults(res)) {
              action(convertToData(res));
            } else if (typeof emptyAction === 'function') {
              if (isRequired) {
                emptyAction(new Error('Images not found.', 500));
              } else {
                emptyAction();
              }
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
