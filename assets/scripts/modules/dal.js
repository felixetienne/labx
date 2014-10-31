module.exports = (function (mod, pg){

    mod.work = function(callback){

        pg.connect(process.env.DATABASE_URL + "?ssl=true", function(err, client) {

            if(err) throw "[ERROR:pg:connect] " + err;
            if(!client) throw "[ERROR:dal:pages:getAll] the parameter 'client' is null";

            callback(client);
        });
    };

    return mod;

})({}, require('pg'));
