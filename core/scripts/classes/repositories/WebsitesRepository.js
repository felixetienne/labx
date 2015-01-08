(function(bricks, BaseRepository, Error) {

  module.exports = function() {
    var _base = new BaseRepository();

    this.getErrors = function() {
      return _base.getErrors();
    }

    this.getWebsiteByName = function(client, websiteName, action,
      emptyAction) {

      var query = bricks
        .select(
          '\
						websites.title, \
						websites.subtitle, \
            websites.copyright, \
            websites.version, \
            websites.author, \
            websites.doc_titleFormat, \
            websites.doc_author, \
            websites.doc_keywords, \
            websites.doc_language, \
						websites.sorting'
        )
        .from('websites')
        .where('websites.name', websiteName)
        .where('websites.active', true)
        .orderBy('websites.sorting ASC')
        .limit(1)
        .toString();

      _base.executeQuery(client, query, emptyAction, function(res) {
        var data = res.rows[0];

        action(data);
      });
    }
  }

})(
  require('sql-bricks-postgres'),
  require('./BaseRepository'),
  require('../Error'));
