
/**
 * Module dependencies.
 */

var env = require('node-env-file');
var express = require('express');

env(__dirname + '/.env');

var app = module.exports = express.createServer();

app
.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
})
.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
})
.configure('production', function(){
  app.use(express.errorHandler());
})
.listen(process.env.PORT, function() {
  console.log("Node app is running at localhost: " + process.env.PORT)
});

var routes = require('./assets/scripts/modules/routes');

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/contact', routes.contact);

var pg = require('pg');

pg.connect(process.env.DATABASE_URL + "?ssl=true", function(err, client) {

    if(err) throw "[ERROR:pg:connect] " + err;

    var Dal = require('./assets/scripts/modules/dal');
    var dal = new Dal(client);

    dal.pages.getAll(function(data){
        console.log(data);
    }, true);

//    var us = require('underscore');
//    var breeze = require('breeze');
});
