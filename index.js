
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes/mainRoutes.js');

var app = module.exports = express.createServer();

// Required by Heroku.
app.set('port', (process.env.PORT || 5000));

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

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
