
/**
 * LabX
 * Felix-Etienne Tetrault
 * Copyright 2014
 */
try{

    var config = require('./core/scripts/modules/appConfig');
    var routes = require('./core/scripts/modules/routes');
    var express = require('express');

    var root = __dirname;
    var port = config.getCurrentPort();
    var app = module.exports = express.createServer();

    if(!app) throw "[ERROR:app] The 'app' cannot be created.";

    app
    .configure(function(){
        app.use(express.static(root + '/public'));
        app.set('views', root + '/views');
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
    .listen(port, function() {
        console.log("Node app is running at localhost: " + port)
    });


    app.get('/', routes.index);
    app.get('/about', routes.about);
    app.get('/contact', routes.contact);
    app.get('/projects', routes.projects);
    app.get('/project/:name', routes.project);
}
catch(e){
    console.error(e);
}
