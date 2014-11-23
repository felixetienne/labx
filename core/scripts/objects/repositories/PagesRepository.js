var BaseRepository = require('./BaseRepository');

module.exports = function PagesRepository(pg, bricks, config){

    var _base = new BaseRepository(pg, config);

    var rowToPage = function(row){
        var page = {
            name: row.name,
            title: row.title,
            shortTitle: row.shortTitle,
            pageTitle: row.pageTitle,
            pageOrder: row.pageOrder,
            pageCategory: row.pageCategory
        };

        return page;
    };

    this.getPageByName = function(pageName, action, emptyAction){

        if(_base.isInvalidAction(action)) return;

        _base.open(function(client){

            var pageQuery =
                bricks
                .select()
                .from('pages')
                .where('pages.name', pageName)
                .where('pages.isactive', true)
                .limit(1)
                .toString();

            client
            .query(pageQuery, function(err, res){

                if(err) {
                    console.log(err);
                    _base.close(client);
                    return;
                }

                if(_base.hasResults(res, emptyAction)) {
                    var data = rowToPage(res.rows[0]);
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
                .select('pages.title')
                .from('pages')
                .where('pages.isactive', true)
                .toString();

             client
            .query(pagesQuery, function(err, res){

                if(_base.hasResults(res, emptyAction)) {
                    var data = new Array();
                    res.rows.forEach(function(row) { data.push(rowToPage(row)) });
                    action(data);
                }

                _base.close(client);
            });
        });
    }
}
