/**
 * LabX
 * Version 0.1.5
 * Felix-Etienne Tetrault
 * Copyright 2014
 */

(function(express, ejs, expressLayouts, dateFormat,
  imageWritingProcessor, routeHelpers, viewHelpers, config) {
  var app = express();
  var port = config.getCurrentPort();
  var root = __dirname;

  console.log('Initialized application "LabX" at ' +
    dateFormat(Date.now()) + '.');

  app.use(expressLayouts);
  app.use(express.static(root + '/public'));
  app.set('views', root + '/views');
  app.set('view engine', 'ejs');
  app.set('layout', 'layout');

  var pages = viewHelpers.getStaticPages();
  for (var i = 0; i < pages.length; i++) {
    var p = pages[i];
    app.get('/' + p, routeHelpers.getRoute(p));
  }

  var page = viewHelpers.getProjectsPage();
  app.get('/' + page + '/:name', routeHelpers.getRoute(page, {
    isProjectCategoryPage: true
  }));

  var page = viewHelpers.getProjectPage();
  app.get('/' + page + '/:name', routeHelpers.getRoute(page, {
    isProjectPage: true
  }));

  var page = viewHelpers.getEventPage();
  app.get('/' + page + '/:name', routeHelpers.getRoute(page, {
    isEventPage: true
  }));

  app.listen(port, function() {
    console.log("Node app is running at localhost: " + port);
  });

  app.locals.root = root;

  imageWritingProcessor.process();

})(
  require('express'),
  require('ejs'),
  require('express-ejs-layouts'),
  require('dateformat'),
  require('./tasks/processors/imageWritingProcessor'),
  require('./core/scripts/modules/routeHelpers'),
  require('./core/scripts/modules/viewHelpers'),
  require('./core/scripts/modules/appConfig'),
  require('./core/scripts/modules/appCache'));
