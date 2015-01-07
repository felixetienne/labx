(function(q, cache, BaseViewService, Error) {

  module.exports = function(context) {
    var _base = new BaseViewService(context);

    this.getData = function(client, successAction, errorAction) {

      q.all([
          _base.getWebsite(client),
          _base.getPages(client),
          _base.getMenuEvents(client),
          _base.getMenuProjectCategories(client),
          _base.getFeaturedProjects(client),
          _base.getImageBanners(client),
          getEvent(client)
        ])
        .spread(computeData)
        .then(onSuccess)
        .fail(onError)
        .done();

      function getEvent(client) {
        var deferred = q.defer();
        var cacheKey = 'event' + _base.getCacheKeyPageSuffix();

        _base.getFromCache(cacheKey, function(value) {
          if (value !== null) {
            deferred.resolve(value);
            return;
          }

          var request = _base.getCurrentRequest();
          var repo = _base.getEventsRepository(client);

          repo.getEventByName(client, request.params.name,
            function(x) {
              _base.addToCache(cacheKey, x, function() {
                deferred.resolve(x);
              });
            },
            function() {
              _base.addErrors(repo.getErrors());
              _base.addError(new Error('Event not found', 404));
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
        menuProjectCategories, featuredProjects, imageBanners, event) {
        var data = _base.getBasicViewData({
          website: website,
          pages: pages,
          menuEvents: menuEvents,
          menuProjectCategories: menuProjectCategories,
          featuredProjects: featuredProjects,
          imageBanners: imageBanners
        });

        var viewData = getViewData(event, website);
        data.page = viewData.page;
        data.event = viewData.event;

        return data;
      }

      function getViewData(event, website) {
        var data = {};

        data.page = {
          title: event.title || '',
          descriptionHtml: event.description_html || '',
          keywords: event.keywords,
          docTitle: _base.getDocTitle(event, website),
          docDescription: event.doc_description || event.description_short ||
            '',
          docKeywords: _base.getDocKeywords(event, website)
        };

        data.event = {
          date: _base.formatDate(event.date),
          images: event.images
        };

        return data;
      }
    }
  }

})(
  require('q'),
  require('../../modules/appCache'),
  require('./BaseViewService'),
  require('../Error'));
