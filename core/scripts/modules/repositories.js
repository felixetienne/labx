module.exports = (function(mod, fs, pg, bricks){

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

    var open = function(callback){
        pg.connect(process.env.DATABASE_URL + "?ssl=true", function(err, client) {

            if(err) throw "[ERROR:pg:connect] " + err;
            if(!client) throw "[ERROR:dal:pages:getAll] the parameter 'client' is null";

            callback(client);
        });
    };

    var close = function(client){ client.end(); }

    mod.projects = {
        getFromName: function(projectName, imageFolder, action, emptyAction){
            if(isInvalidAction(action)) return;

            open(function(client){

                var projectQuery =
                    bricks
                    .select("   projects.title as projectitle, \
                                images.title as imagetitle, \
                                images.id as imageid, \
                                images.name as imagename")
                    .from('projects')
                    .join('images', { 'projects.id': 'images.projectid' })
                    .where('projects.name', projectName)
                    .limit(1)
                    .toString();

                client
                .query(projectQuery, function(err, res){

                    if(err) {
                        console.log(err);
                        close(client);
                        return;
                    }

                    if(hasResults(res, emptyAction)) {

                        var p = res.rows[0];
                        var imagePath = imageFolder + p.imagename + '.jpg';

                        var data = {
                            title: p.projecttitle,
                            image: {
                                title: p.imagetitle,
                                path: imagePath
                            }
                        };

                        testImage(imagePath, function(fullImagePath){

                            open(function(client2){

                                var imageQuery =
                                    bricks
                                    .select("images.image as rawimage")
                                    .from('images')
                                    .where('images.id', p.imageId)
                                    .toString();

                                client2
                                .query(imageQuery, function(imageError, imageResult){

                                    if(imageError) {
                                        console.log(imageError);
                                        close(client2);
                                        return;
                                    }

                                    var i = imageResult.rows[0];

                                    writeImage(fullImagePath, i.rawimage);

                                    close(client2);
                                });
                            });
                        });

                        action(data);
                    }

                    close(client);
                });
            });
        }
    };

    mod.pages = {
        getFromName: function(pageName, action, emptyAction){

            if(isInvalidAction(action)) return;

            open(function(client){

                var pageQuery =
                    bricks
                    .select()
                    .from('pages')
                    .where('pages.name', pageName)
                    .limit(1)
                    .toString();

                client
                .query(pageQuery, function(err, res){

                    if(err) {
                        console.log(err);
                        close(client);
                        return;
                    }

                    if(hasResults(res, emptyAction)) {
                        var data = rowToPage(res.rows[0]);
                        action(data);
                    }

                    close(client);
                });
            });
        },
        getAll: function(action, emptyAction){

            if(isInvalidAction(action)) return;

            open(function(client){

                var pagesQuery =
                    bricks
                    .select()
                    .from('pages')
                    .toString();

                 client
                .query(pagesQuery, function(err, res){

                    if(hasResults(res, emptyAction)) {

                        var data = [];

                        res.rows.forEach(function(row) { data.push(rowToPage(row)) });

                        action(data);
                    };

                    client.end();
                });
            });
        }
    };

    return mod;

})({}, require('fs'), require('pg'), require('sql-bricks-postgres'));
