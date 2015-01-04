(function(BaseRepository, Error) {

  module.exports = function(config, pg, bricks) {
    var _base = new BaseRepository(config, pg);
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
            events.id, \
            get_event_image_list(events.id, FALSE) as image_list'
          )
          .from('events')
          .where('events.active', true)
          .where('events.name', eventName)
          .orderBy(
            'events.date DESC',
            'events.sorting ASC'
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

              data.images = _base.extractMedias(data.image_list,
                true);

              action(data);
            } else if (typeof emptyAction === 'function') {
              emptyAction();
            }

            _base.close(client);
          });
      });
    }

    this.getAllEvents = function(action, emptyAction) {
      if (_base.isInvalidAction(action)) return;

      _base.open(function(client) {
        var query = bricks
          .select(
            '\
            events.name, \
            events.date, \
            events.title, \
            events.title_short, \
            events.description_short, \
            events.sorting, \
            events.id, \
            get_event_image_list(events.id, TRUE) as image_list'
          )
          .from('events')
          .where('events.active', true)
          .orderBy(
            'events.date DESC',
            'events.sorting ASC'
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

                row.images = _base.extractMedias(
                  row.image_list);

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

    this.getMenuEvents = function(maximumEvents, action,
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
            events.id'
          )
          .from('events')
          .where('events.active', true)
          .orderBy(
            'events.date DESC',
            'events.sorting ASC'
          );

        if (maximumEvents) {
          query = query.limit(maximumEvents);
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
