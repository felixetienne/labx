module.exports = (function(mod, dal, fs, buffer){

    var rootPath = __dirname + "/../../../public";

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

    var writeImage = function(fullImagePath, rawData){
        fs.writeFile(fullImagePath, rawData, function (error) {
          if (error) throw error;
        });
    };

    var testImage = function(imagePath, notExistsAction){
        var fullPath = rootPath + imagePath;
        fs.exists(fullPath, function(exists){
            if(exists) return;
            notExistsAction(fullPath);
        });
    };

    mod.pages = {};
    mod.projects = {};

    mod.projects.getFromName = function(name, imageFolder, action, emptyAction){

        if(isInvalidAction(action)) return;

        dal.work(function(client){

            client
            .query(dal.queries.projects.getFromNameQuery(name))
            .on('row', function(row, res){ res.addRow(row) })
            .on('end', function(res){

                if(hasResults(res, emptyAction)) {

                    var d = res.rows[0];

                    var imagePath = imageFolder + d.imagename + '.jpg';

                    var data = {
                        title: d.projecttitle,
                        image: {
                            title: d.imagetitle,
                            path: imagePath
                        }
                    };

                    testImage(imagePath, function(fullImagePath){

                        dal.work(function(c){

                            var image = c
                            .query(dal.queries.images.getRawDataFromIdQuery(d.imageid))
                            .on('row', function(row, res){ res.addRow(row) })
                            .on('end', function(imageResult){

                                var i = imageResult.rows[0];

                                writeImage(fullImagePath, i.rawimage);

                                c.end();
                            });
                        });
                    });

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

})({}, require('./dal'), require('fs'), require('buffer'));
