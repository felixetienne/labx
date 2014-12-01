(function(BaseRepository){

    module.exports = function (pg, bricks, config){

        var _base = new BaseRepository(pg, config);

        this.getPageByName = function(pageName, action, emptyAction){

            if(_base.isInvalidAction(action)) return;

            _base.open(function(client){

                var pageQuery =
                    bricks
                    .select('   pages.title as title, \
                                pages.title_short as title_short, \
                                pages.description as description, \
                                pages.name')
                    .from('pages')
                    .where('pages.name', pageName)
                    .where('pages.active', true)
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

        this.getBasicPages = function(action, emptyAction){

            if(_base.isInvalidAction(action)) return;

            _base.open(function(client){

                var pagesQuery =
                    bricks
                    .select('   pages.title_short, \
                                pages.description_short, \
                                pages.name')
                    .from('pages')
                    .where('pages.active', true)
                    //.orderBy('pages.order')
                    .toString();

                 client
                .query(pagesQuery, function(err, res){

                    if(err) {
                        _base.close(client);
                        throw err;
                    }

                    if(_base.hasResults(res, emptyAction)) {
                        var data = new Array();
                        res.rows.forEach(function(row) { data.push(row); });
                        action(data);
                    }

                    _base.close(client);
                });
            });
        }
    }

})(require('./BaseRepository'));
