module.exports = (function(mod, dal){

    var isInvalidAction = function(action){

        if(!action) throw "[ERROR:Dal:getAll] 'action' parameter is null.";
        if(typeof(action) != "function") throw "[ERROR:Dal:getAll] 'action' parameter is not a function.";

        return false;
    };

    var hasResults = function(res, emptyAction){

        if(typeof(res) == 'undefined') throw "[ERROR:repositories:hasResults] 'res' is undefined.";

        if(typeof(res.rows) != 'undefined' && res.rows.length > 0) return true;

        if(typeof(emptyAction) == 'function') emptyAction();

        return false;
    };

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

    mod.pages = {};

    mod.pages.getFromName = function(name, action, emptyAction){

        if(isInvalidAction(action)) return;

        dal.work(function(client){

            client
            //.query('SELECT * FROM Pages WHERE Pages.Name = $1 LIMIT 1', [name])
            .query(dal.queries.pages.getFromNameQuery(name))
            .on('row', function(row, res){ res.addRow(row) })
            .on('end', function(res){

                if(hasResults(res, emptyAction)) {

                    var page = rowToPage(res.rows[0]);

                    action(page);
                }

                client.end();
            });
        });
    };

    mod.pages.getAll = function(action, emptyAction){

        if(isInvalidAction(action)) return;

        dal.work(function(client){

             client
            .query('SELECT * FROM Pages')
            .on('row', function(row, res) { res.addRow(row) })
            .on('end', function(res){

                if(hasResults(res, emptyAction)) {

                    var pages = [];

                    res.rows.forEach(function(row) { pages.push(rowToPage(row)) });

                    action(pages);
                };

                client.end();
            });
        });
    };

    return mod;

})({}, require('./dal'));
