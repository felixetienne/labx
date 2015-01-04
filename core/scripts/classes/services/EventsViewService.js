(function(q, dateFormat, BaseViewService, Error) {

  module.exports = function(context, config, repositoriesFactory, viewHelpers) {
    var _base = new BaseViewService(context, config, repositoriesFactory,
      viewHelpers, dateFormat);

    this.getData = function(successAction, errorAction) {

      return q
        .all([
          _base.getWebsite(),
          _base.getPages(),
          _base.getMenuEvents(),
          _base.getMenuProjectCategories(),
          _base.getImageBanners(),
          _base.getPage(),
          getEvents()
        ])
        .spread(computeData)
        .then(onSuccess)
        .fail(onError)
        .done();

      function getEvents() {
        var deferred = q.defer();
        var repo = _base.getEventsRepository();

        repo.getAllEvents(function(x) {
            deferred.resolve(x);
          },
          function() {
            _base.addErrors(repo.getErrors());
            _base.addError(new Error('Events not found', 404));
            deferred.reject();
          });

        return deferred.promise;
      }

      function onSuccess(data) {
        successAction(data, context);
      }

      function onError() {
        errorAction(_base.getErrors(), context);
      }

      function computeData(website, pages, menuEvents,
        menuProjectCategories, imageBanners, page, events) {
        var data = _base.getBasicViewData({
          website: website,
          pages: pages,
          menuEvents: menuEvents,
          menuProjectCategories: menuProjectCategories,
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
  require('dateformat'),
  require('./BaseViewService'),
  require('../Error'));
