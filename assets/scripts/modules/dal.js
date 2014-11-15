module.exports = (function (mod, pg, queryBuilder){

    mod.queries = {
        pages:{
            getAllQuery: function(){
                var q = queryBuilder
                .select()
                .from('pages')
                .toString();

                return q;
            },
            getFromNameQuery: function(pageName){
                var q = queryBuilder
                .select()
                .from('pages')
                .where('pages.name', pageName)
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
                            images.id as imageid, \
                            images.name as imagename")
                .from('projects')
                .join('images', { 'projects.id': 'images.projectid' })
                .where('projects.name', projectName)
                .limit(1)
                .toString();

                return q;
            }
        },
        images:{
            getRawDataFromIdQuery: function(imageId){
                var q = queryBuilder
                .select("images.image as rawimage")
                .from('images')
                .where('images.id', imageId)
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
