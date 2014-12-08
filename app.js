/**
 * LabX
 * Version 0.1.0
 * Felix-Etienne Tetrault
 * Copyright 2014
 */

(function(express, ejs, expressLayouts, imageWritingProcessor, routes,
  viewsDef, appConfig) {
  var app = express();
  var port = appConfig.getCurrentPort();
  var root = __dirname;

  app.use(expressLayouts);
  app.use(express.static(root + '/public'));
  app.set(
    'views', root + '/views');
  app.set('view engine', 'ejs');
  app.set('layout',
    'layout');
  //app.engine('ejs', ejs.__express);

  app.get('/', routes.index);
  app.get('/about', routes.about);
  app.get(
    '/contact', routes.contact);
  app.get('/projects', routes.projects);
  app.get(
    '/project/:name', routes.project);

  app.listen(port, function() {
    console.log("Node app is running at localhost: " + port);
  });

  app.locals.root = root;

  imageWritingProcessor.process();

})(
  require('express'),
  require('ejs'),
  require('express-ejs-layouts'),
  require('./tasks/processors/imageWritingProcessor'),
  require('./core/scripts/modules/routes'),
  require('./core/scripts/modules/viewsDef'),
  require('./core/scripts/modules/appConfig'));
