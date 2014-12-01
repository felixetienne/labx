(function(BaseRepository){

    module.exports = function (pg, bricks, config){

        var _base = new BaseRepository(pg, config);

        this.getWebsiteProperties = function(websiteName, action, emptyAction){

            if(_base.isInvalidAction(action)) return;

            _base.open(function(client){

                var pageQuery =
                    bricks
                    .select('   website.title, \
                                website.subtitle, \
                                website.date')
                    .from('website')
                    .where('website.name', websiteName)
                    .where('website.active', true)
                    .limit(1)
                    .toString();

                client
                .query(pageQuery, function(err, res){

                    if(err) {
                        _base.close(client);
                        throw err;
                    }

                    if(_base.hasResults(res, emptyAction)) {
                        var data = res.rows[0];
                        action(data);
                    }

                    _base.close(client);
                });
            });
        }
    }

})(require('./BaseRepository'));
