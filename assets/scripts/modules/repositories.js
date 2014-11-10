module.exports = (function(mod, dal, fs){

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
    mod.projects = {};

    mod.projects.getFromName = function(name, action, emptyAction){

        if(isInvalidAction(action)) return;

        dal.work(function(client){

            client
            .query(dal.queries.projects.getFromNameQuery(name))
            .on('row', function(row, res){ res.addRow(row) })
            .on('end', function(res){

                if(hasResults(res, emptyAction)) {

                    var project = res.rows[0];

                    var data = {
                        name: project.name,
                        image: {
                            title: "test"
                        }
                    };

                    console.log(project.image);
                    fs.writeFile(dal.temporaryImageDir + '/test.jpg', project.image);


                    action(data);
                }

                client.end();
            });
        });
    };

    mod.pages.getFromName = function(name, action, emptyAction){

        if(isInvalidAction(action)) return;

        dal.work(function(client){

            client
            .query(dal.queries.pages.getFromNameQuery(name))
            .on('row', function(row, res){ res.addRow(row) })
            .on('end', function(res){

                if(hasResults(res, emptyAction)) {

                    var data = rowToPage(res.rows[0]);

                    action(data);
                }

                client.end();
            });
        });
    };

    mod.pages.getAll = function(action, emptyAction){

        if(isInvalidAction(action)) return;

        dal.work(function(client){

             client
            .query(dal.queries.pages.getAllQuery())
            .on('row', function(row, res) { res.addRow(row) })
            .on('end', function(res){

                if(hasResults(res, emptyAction)) {

                    var data = [];

                    res.rows.forEach(function(row) { data.push(rowToPage(row)) });

                    action(data);
                };

                client.end();
            });
        });
    };

    return mod;

})({}, require('./dal'), require('fs'));
