(function(q, cache, viewHelpers, BaseViewService, Error) {

	module.exports = function(context) {
		var _base = new BaseViewService(context);

		this.getData = function(successAction, errorAction) {

			_base.initializeClient(function() {

				q.all([
						_base.getWebsite(),
						_base.getPages(),
						_base.getMenuEvents(),
						_base.getMenuProjectCategories(),
						_base.getFeaturedProjects(),
						_base.getImageBanners(),
						_base.getPage(),
						getEvents()
					])
					.spread(computeData)
					.then(onSuccess)
					.fail(onError)
					.done(_base.onComplete);

				function getEvents() {
					var deferred = q.defer();
					var cacheKey = 'events';

					_base.getFromCache(cacheKey, function(value) {
						if (value !== null) {
							deferred.resolve(value);
							return;
						}

						var repo = _base.getEventsRepository();
						var options = _base.getBasicOptions();

						repo.getAllEvents(_base.getClient(), options,
							function(x) {
								_base.addToCache(cacheKey, x, function() {
									deferred.resolve(x);
								});
							},
							function() {
								_base.addErrors(repo.getErrors());
								_base.addError(new Error('Events not found',
									404));
								deferred.reject();
							});
					});

					return deferred.promise;
				}

				function onSuccess(data) {
					successAction(data, context, _base.getErrors());
				}

				function onError() {
					errorAction(context, _base.getErrors());
				}

				function computeData(website, pages, menuEvents,
					menuProjectCategories, featuredProjects, imageBanners,
					page,
					events) {
					var data = _base.getBasicViewData({
						website: website,
						pages: pages,
						menuEvents: menuEvents,
						menuProjectCategories: menuProjectCategories,
						featuredProjects: featuredProjects,
						imageBanners: imageBanners
					});

					var viewData = getViewData(page, events, website);
					data.page = viewData.page;
					data.events = viewData.events;

					return data;
				}

				function getViewData(page, events, website) {
					var data = {
						page: _base.getStandardPageData(page, website),
						events: []
					};
					var _eventPage = viewHelpers.getEventPage();
					var builUrl = function(eventName) {
						var url = '/' + _eventPage + '/' + eventName;
						return url;
					}

					for (var i = 0; i < events.length; i++) {
						var event = events[i];
						var eventData = {
							title: event.title_short || event.title || '',
							description: event.description_short || '',
							date: _base.formatDate(event.date),
							url: builUrl(event.name),
							images: event.images
						};

						data.events.push(eventData);
					}

					return data;
				}
			});
		}
	}

})(
	require('q'),
	require('../../modules/appCache'),
	require('../../modules/viewHelpers'),
	require('./BaseViewService'),
	require('../Error'));
