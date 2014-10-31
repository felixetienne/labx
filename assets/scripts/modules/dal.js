module.exports = function Dal (client){

    if(!client) throw "[ERROR:dal:pages:getAll] the parameter 'client' is null";

    module.pages = {};

    module.pages.getAll = function(action, mustClose){

        if(!action) throw "[ERROR:Dal:getAll] 'action' parameter is null.";
        if(typeof(action) != "function") throw "[ERROR:Dal:getAll] 'action' parameter is not a function.";

        client
        .query('SELECT * FROM Pages')
        .on('row', function(row, res) {

            //console.log(JSON.stringify(r));

            res.addRow(row);
        })
        .on('end', function(res){

            var pages = [];

            res.rows.forEach(function(row){
                var page = {
                    name: row.name,
                    title: row.title,
                    pageTitle: row.pageTitle,
                    pageOrder: row.pageOrder,
                    pageCategory: row.pageCategory
                };

                pages.push(page);
            });

            action(pages);

            if(mustClose) client.end();
        });
    };

    return module;
};
