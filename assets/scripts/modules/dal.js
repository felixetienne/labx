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

    tables.images = { name: 'images' };
    tables.images.columns = {
        name: getColumnName(tables.images, 'name'),
        title: getColumnName(tables.images, 'title'),
        image: getColumnName(tables.images, 'image'),
        projectId: getColumnName(tables.images, 'projectId')
    };

    tables.projects = { name: 'projects' };
    tables.projects.columns = {
        id: getColumnName(tables.projects, 'id'),
        title: getColumnName(tables.projects, 'title')
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
        },
        projects:{
            getFromNameQuery: function(projectName){
                var q = queryBuilder
                .select("   projects.title as projectitle, \
                            images.title as imagetitle, \
                            images.name as imagename, \
                            encode(images.image, 'base64') as rawimage")//encode(images.image, 'base64')
                .from(tables.projects.name)
                .join('images', {'projects.id': 'images.projectid' })
                .where('projects.name', projectName)
                .limit(1)
                .toString();
                console.log(q);

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
