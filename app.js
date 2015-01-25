/**
 * LabX Framework
 * Felix-Etienne Tetrault
 * Copyright 2014-2015
 */

(function(express, ejs, expressLayouts, dateFormat,
	imageWritingProcessor, routeHelpers, viewHelpers, config) {
	var app = express();
	var port = config.getCurrentPort();
	var root = __dirname;

	console.log('"LabX Framework" app is initialized at ' +
		dateFormat(Date.now()) + '.');

	app.use(expressLayouts);
	app.use(express.static(root + '/public'));
	app.set('views', root + '/views');
	app.set('view engine', 'ejs');
	app.set('layout', 'layout');

	var options = {
		includesDraft: config.currentTypeIsDevelopment()
	};

	var pages = viewHelpers.getStandardPages();
	for (var i = 0; i < pages.length; i++) {
		var p = pages[i];
		app.get('/' + p, routeHelpers.getRouteCallback(p, options));
	}

	var page = viewHelpers.getProjectsPage();
	app.get('/' + page + '/:name', routeHelpers.getRouteCallback(page,
		mergeObjects(options, {
			isProjectCategoryPage: true
		})));

	var page = viewHelpers.getProjectPage();
	app.get('/' + page + '/:name', routeHelpers.getRouteCallback(page,
		mergeObjects(options, {
			isProjectPage: true
		})));

	var page = viewHelpers.getEventPage();
	app.get('/' + page + '/:name', routeHelpers.getRouteCallback(page,
		mergeObjects(options, {
			isEventPage: true
		})));

	app.listen(port, function() {
		console.info('NodeJs application is accessible at port ' + port + '.');
	});

	app.locals.root = root;

	imageWritingProcessor.process();

	function includesDraft(arr) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] === 'includesDraft') return true;
		}

		return false;
	}

	function mergeObjects(obj1, obj2) {
		var obj = {};

		for (var k in obj1) {
			obj[k] = obj1[k];
		}

		for (var k in obj2) {
			obj[k] = obj2[k];
		}

		return obj;
	}

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
