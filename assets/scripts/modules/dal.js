module.exports = function Dal (client){

   //return (function(module, client){

        if(!client) throw "[ERROR:dal:pages:getAll] the parameter 'client' is null";

        module.pages = {
            getAll:function(){

                var data = [];

                var q = client.query('SELECT * FROM Pages');

                q.on('row', function(r) {

                    console.log(JSON.stringify(r));

                    var page = {
                        "name": r.name,
                        title: r.title,
                        pageTitle: r.pageTitle,
                        pageOrder: r.pageOrder,
                        pageCategory: r.pageCategory
                    };

                    data.push(page);

                });

                return data;
            }
        };

        return module;
};
