
/**
 * LabX
 * Felix-Etienne Tetrault
 * Copyright 2014
 */

var express = require('express');

var app = module.exports = express.createServer();

app
.configure(function(){
    app.use(express.static(__dirname + '/public'));
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
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
app.get('/project/:name', routes.project);
