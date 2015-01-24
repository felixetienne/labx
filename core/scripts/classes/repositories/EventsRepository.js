(function(bricks, BaseRepository, Error) {

  module.exports = function() {
    var _base = new BaseRepository();
    var _imageFolder = _base.getConfig().getImageFolder();

    this.getErrors = function() {
      return _base.getErrors();
    }

    this.getEventByName = function(client, options, action, emptyAction) {

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
            get_event_image_list(events.id, \'standard\') as image_list'
        )
        .from('events');

      if (options.publishedOnly) {
        query = query
          .where('events.published', true);
      }

      query = query
        .where('events.active', true)
        .where('events.name', options.eventName)
        .orderBy(
          'events.date DESC',
          'events.sorting ASC'
        )
        .limit(1)
        .toString();

      _base.executeQuery(client, query, emptyAction, function(res) {
        var data = res.rows[0];

        data.images = _base.extractMedias(data.image_list, true);

        action(data);
      });
    }

    this.getAllEvents = function(client, options, action, emptyAction) {

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
            get_event_image_list(events.id, \'thumbnail\') as image_list'
        )
        .from('events');

      if (options.publishedOnly) {
        query = query
          .where('events.published', true);
      }

      query = query
        .where('events.active', true)
        .orderBy(
          'events.date DESC',
          'events.sorting ASC'
        )
        .toString();

      _base.executeQuery(client, query, emptyAction, function(res) {
        var data = [];

        res.rows.forEach(function(row) {

          row.images = _base.extractMedias(
            row.image_list);

          data.push(row);
        });

        action(data);
      });
    }

    this.getMenuEvents = function(client, options, action, emptyAction) {

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
        .from('events');

      if (options.publishedOnly) {
        query = query
          .where('events.published', true);
      }

      query = query
        .where('events.active', true)
        .orderBy(
          'events.date DESC',
          'events.sorting ASC'
        );

      if (options.maximumEvents) {
        query = query
          .limit(options.maximumEvents);
      }

      query = query.toString();

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
