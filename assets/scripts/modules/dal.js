module.exports = (function (mod, pg, queryBuilder){

    var getColumnName = function(table, column){ return  table.name + '.' + column; }

    var tables = {};
    tables.pages = { name: 'pages' };
    tables.pages.columns = {
        name: getColumnName(tables.pages, 'name'),
        title: getColumnName(tables.pages, 'title'),
        pageTitle: getColumnName(tables.pages, 'pageTitle'),
        pageOrder: getColumnName(tables.pages, 'pageOrder')
    };
    tables.pageCategories = { name: 'pageCategories' };
    tables.pageCategories.columns = {
        title: getColumnName(tables.pageCategories, 'title')
    };

    mod.queries = {
        pages:{
            getAllQuery: function(){
                var q = queryBuilder
                .select()
                .from(tables.pages.name)
                .toString();

                return q;
            },
            getFromNameQuery: function(pageName){
                var q = queryBuilder
                .select()
                .from(tables.pages.name)
                .where(tables.pages.columns.name, pageName)
                .limit(1)
                .toString();

                return q;
            }
        }
    };

    mod.work = function(callback){

        pg.connect(process.env.DATABASE_URL + "?ssl=true", function(err, client) {

            if(err) throw "[ERROR:pg:connect] " + err;
            if(!client) throw "[ERROR:dal:pages:getAll] the parameter 'client' is null";

            callback(client);
        });
    };

    return mod;

})({}, require('pg'), require('sql-bricks-postgres'));
