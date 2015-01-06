(function(q, cache, viewHelpers, BaseViewService, Error) {

  module.exports = function(context) {
    var _base = new BaseViewService(context);

    this.getData = function(successAction, errorAction) {

      _base.pg.connect(_base.getDatabaseUrl(), function(err, client) {
        if (err || !client) console.error(
          '[ERROR:pg:connect] Error: ' + err + ', client: ' +
          client + '.');

        q.all([
            _base.getWebsite(client),
            _base.getPages(client),
            _base.getMenuEvents(client),
            _base.getMenuProjectCategories(client),
            _base.getFeaturedProjects(client),
            _base.getImageBanners(client),
            _base.getPage(client),
            getEvents(client)
          ])
          .spread(computeData)
          .then(onSuccess)
          .fail(onError)
          .done(function() {
            client.end();
          });
      });

      function getEvents(client) {
        var deferred = q.defer();
        var cacheKey = 'events';

        _base.getFromCache(cacheKey, function(value) {
          if (value !== null) {
            deferred.resolve(value);
            return;
          }

          var repo = _base.getEventsRepository();

          repo.getAllEvents(client, function(x) {
              _base.addToCache(cacheKey, x, function() {
                deferred.resolve(x);
              });
            },
            function() {
              _base.addErrors(repo.getErrors());
              _base.addError(new Error('Events not found', 404));
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
        menuProjectCategories, featuredProjects, imageBanners, page,
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
    }
  }

})(
  require('q'),
  require('../../modules/appCache'),
  require('../../modules/viewHelpers'),
  require('./BaseViewService'),
  require('../Error'));
