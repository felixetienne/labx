(function(q, BasePageService, Error) {

  module.exports = function(context, repositoriesFactory, viewHelpers) {
    var _base = new BasePageService(context, viewHelpers);
    var _pagesRepository = repositoriesFactory.createPagesRepository();
    var _websitesRepository = repositoriesFactory.createWebsitesRepository();
    var _projectsRepository = repositoriesFactory.createProjectsRepository();

    this.getData = function(successAction, errorAction) {

      return q
        .all([
          getWebsiteProperties(),
          getPageByName(),
          getMenuPages(),
          getProjectByName()
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

      function getMenuPages() {
        var deferred = q.defer();

        _pagesRepository.getMenuPages(function(x) {
          deferred.resolve(x);
        }, function(e) {
          _base.addErrors(e);
          deferred.reject();
        }, true);

        return deferred.promise;
      }

      function getProjectByName() {
        var deferred = q.defer();

        _projectsRepository.getProjectByName(_base.currentRequest.params
          .name,
          function(x) {
            deferred.resolve(x);
          },
          function(e) {
            _base.addErrors(e);
            deferred.reject();
          }, true);

        return deferred.promise;
      }

      function computeData(website, page, menuPages, project) {
        var data = _base.getPageData({
          website: website,
          page: page,
          menuPages: menuPages
        });

        data.page.docTitle = project.title;
        data.page.title = project.title;
        data.page.description = project.description;

        data.project = {
          date: project.date,
          category: project.category_title,
          image: {
            title: project.image_title,
            url: project.image_path
          }
        };

        return data;
      }
    }
  }

})(
  require('q'),
  require('./BasePageService'),
  require('../Error'));
