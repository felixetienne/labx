(function(BaseRepository, Error) {

  module.exports = function(pg, bricks, config) {
    var _base = new BaseRepository(pg, config);

    this.getErrors = function() {
      return _base.getErrors();
    }

    this.getWebsiteByName = function(websiteName, action, emptyAction) {

      if (_base.isInvalidAction(action)) return;

      _base.open(function(client) {
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
