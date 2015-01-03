(function(q, dateFormat, BaseViewService, Error) {

  module.exports = function(context, repositoriesFactory, viewHelpers) {
    var _base = new BaseViewService(context, repositoriesFactory,
      viewHelpers, dateFormat);

    this.getData = function(successAction, errorAction) {

      return q
        .all([
          _base.getWebsite(),
          _base.getPages(),
          _base.getMenuEvents(),
          _base.getMenuProjectCategories(),
          _base.getImageBanners(),
          getEvent()
        ])
        .spread(computeData)
        .then(onSuccess)
        .fail(onError)
        .done();

      function getEvent() {
        var deferred = q.defer();
        var request = _base.getCurrentRequest();
        var repo = _base.getEventsRepository();

        repo.getEventByName(request.params.name,
          function(x) {
            deferred.resolve(x);
          },
          function() {
            _base.addErrors(repo.getErrors());
            _base.addError(new Error('Event not found', 404));
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
        menuProjectCategories, imageBanners, event) {
        var data = _base.getBasicViewData({
          website: website,
          pages: pages,
          menuEvents: menuEvents,
          menuProjectCategories: menuProjectCategories,
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
  require('dateformat'),
  require('./BaseViewService'),
  require('../Error'));
