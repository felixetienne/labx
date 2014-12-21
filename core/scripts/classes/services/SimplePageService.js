(function(q, BasePageService, Error) {

  module.exports = function(context, repositoriesFactory, viewHelpers) {
    var _base = new BasePageService(context, viewHelpers);
    var _pagesRepository = repositoriesFactory.createPagesRepository();
    var _websitesRepository = repositoriesFactory.createWebsitesRepository();

    this.getData = function(successAction, errorAction) {

      return q
        .all([
          getWebsiteProperties(),
          getPageByName(),
          getBasicPages()
        ])
        .spread(computeData)
        .then(onSuccess)
        .fail(onError)
        .done();

      function onSuccess(data) {
        successAction(data, context);
      }

      function onError() {
        errorAction(_base.getErrors(), context);
      }

      function getWebsiteProperties() {
        var deferred = q.defer();

        _websitesRepository.getWebsiteProperties(context.getCurrentWebsiteName(),
          function(x) {
            deferred.resolve(x);
          },
          function(e) {
            _base.addErrors(e);
            deferred.reject();
          }, true);

        return deferred.promise;
      }

      function getPageByName() {
        var deferred = q.defer();

        _pagesRepository.getPageByName(_base.currentPage, function(x) {
          deferred.resolve(x);
        }, function(e) {
          _base.addErrors(e);
          deferred.reject();
        }, true);

        return deferred.promise;
      }

      function getBasicPages() {
        var deferred = q.defer();

        _pagesRepository.getBasicPages(function(x) {
          deferred.resolve(x);
        }, function(e) {
          _base.addErrors(e);
          deferred.reject();
        }, true);

        return deferred.promise;
      }

      function computeData(properties, page, pages) {
        var data = _base.getPageData({
          website: properties,
          page: page,
          allPages: pages
        });

        return data;
      }
    }
  }

})(require('q'),
  require('./BasePageService'),
  require('../Error'));
