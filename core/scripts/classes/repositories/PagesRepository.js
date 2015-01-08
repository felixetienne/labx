(function(bricks, BaseRepository, Error) {

  module.exports = function() {
    var _base = new BaseRepository();

    this.getErrors = function() {
      return _base.getErrors();
    }

    this.getPageByName = function(client, pageName, action, emptyAction) {

      var query =
        bricks
        .select(
          '\
						pages.title, \
            pages.description_html, \
            pages.description_short, \
            pages.keywords, \
            pages.doc_title, \
            pages.doc_description, \
            pages.doc_keywords, \
						pages.sorting, \
            pages.name'
        )
        .from('pages')
        .where('pages.name', pageName)
        .where('pages.active', true)
        .orderBy('pages.sorting ASC')
        .limit(1)
        .toString();

      _base.executeQuery(client, query, emptyAction, function(res) {
        var data = res.rows[0];

        action(data);
      });
    }

    this.getAllPages = function(client, action, emptyAction) {

      var query = bricks
        .select(
          '\
            pages.title, \
						pages.title_short, \
            pages.name, \
            pages.menu, \
            pages.footer, \
						pages.sorting'
        )
        .from('pages')
        .where('pages.active', true)
        .orderBy('pages.sorting ASC')
        .toString();

      _base.executeQuery(client, query, emptyAction, function(res) {
        var data = [];

        res.rows.forEach(function(row) {
          data.push(row);
        });

        action(data);
      });
    };
  }

})(
  require('sql-bricks-postgres'),
  require('./BaseRepository'),
  require('../Error'));
