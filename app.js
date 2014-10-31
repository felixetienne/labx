
/**
 * Module dependencies.
 */

var pg = require('pg');
var breeze = require('breeze');
var env = require('node-env-file');
var us = require('underscore');
var express = require('express');
var routes = require('./assets/scripts/modules/routes.js');
var Dal = require('./assets/scripts/modules/dal.js');

env(__dirname + '/.env');

console.log(process.env.DATABASE_URL);

// Server

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/contact', routes.contact);

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Node app is running at localhost: " + port)
});

// Database

var dbUrl = process.env.DATABASE_URL + "?ssl=true";

pg.connect(dbUrl, function(err, client) {

    if(err) throw "[ERROR:pg.connect] " + err;

    var dal = new Dal(client);

    console.log(dal.pages.getAll());
//
//    var query = client.query('SELECT * FROM Pages');
//
//    console.log("[INFO:LabX] Available pages:");
//
//     query.on('row', function(row) {
//        console.log(JSON.stringify(row));
//    });


});

//var manager = new breeze.EntityManager('api/test');
//
//var query = new breeze.EntityQuery()
//    .from("Pages");
//
//manager.executeQuery(query).then(function(data){
//   console.log(data);
//}).fail(function(e) {
//    alert(e);
//});
