(function(BaseRepository, Error) {

  module.exports = function(pg, bricks, config) {
    var _base = new BaseRepository(pg, config);
    var _imageFolder = config.getImageFolder();

    this.getErrors = function() {
      return _base.getErrors();
    }

    this.getEventByName = function(eventName, action,
      emptyAction) {
      if (_base.isInvalidAction(action)) return;

      _base.open(function(client) {
        var query = bricks
          .select(
            '\
            events.date, \
            events.title, \
            events.description_html, \
            events.description_short, \
            events.doc_description, \
            events.doc_title, \
            events.doc_keywords, \
            events.keywords, \
            events.id'\
            // , \
            // images.title as image_title, \
            // images.name as image_name, \
            // images.sorting as image_sorting'
          )
          .from('events')
          // .join('images', {
          //   'projects.id': 'images.id'
          // })
          //.where('images.thumbnail', false)
          //.where('images.active', true)
          .where('events.active', true)
          .where('events.name', eventName)
          .orderBy('events.date DESC', 'events.sorting ASC'
            //, 'image_sorting ASC'
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

    this.getMenuEvents = function(maxEvents, action,
      emptyAction) {
      if (_base.isInvalidAction(action)) return;

      _base.open(function(client) {
        var query = bricks
          .select(
            '\
            events.name, \
            events.date, \
            events.title, \
            events.title_short, \
            events.sorting, \
            events.id'\
            // , \
            // images.title as image_title, \
            // images.name as image_name, \
            // images.sorting as image_sorting'
          )
          .from('events')
          // .join('images', {
          //   'events.id': 'images.id'
          // })
          //.where('images.thumbnail', false)
          //.where('images.active', true)
          .where('events.active', true)
          .where('events.name', eventName)
          .orderBy('events.date DESC', 'events.sorting ASC',
            //, 'image_sorting ASC'
          );

        if (maxEvents) {
          query = query.limit(maxEvents);
        }

        query = query.toString();

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

})(
  require('./BaseRepository'),
  require('../Error'));
