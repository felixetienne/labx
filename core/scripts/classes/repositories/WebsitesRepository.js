(function(BaseRepository, Error) {

  module.exports = function(pg, bricks, config) {
    var _base = new BaseRepository(pg, config);

    this.getWebsiteProperties = function(websiteName, action, emptyAction,
      isRequired) {

      if (_base.isInvalidAction(action)) return;

      _base.open(function(client) {

        var query = bricks
          .select(
            '\
						websites.title, \
						websites.subtitle, \
						websites.date,\
            websites.copyright, \
            websites.version'
          )
          .from('websites')
          .where('websites.name', websiteName)
          .where('websites.active', true)
          .limit(1)
          .toString();

        client
          .query(query, function(err, res) {

            if (err) {
              _base.close(client);
              throw err;
            }

            if (_base.hasResults(res)) {
              var data = res.rows[0];
              action(data);
            } else if (typeof emptyAction === 'function') {
              if (isRequired) {
                emptyAction(new Error('Website not found.', 500));
              } else {
                emptyAction();
              }
            }

            _base.close(client);
          });
      });
    }
  }

})(
  require('./BaseRepository'),
  require('../Error'));
