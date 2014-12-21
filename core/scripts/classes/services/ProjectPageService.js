(function(q, BasePageService, Error) {

  module.exports = function(context, repositoriesFactory, viewHelpers) {
    var _base = new BasePageService(context, viewHelpers);
    var _pagesRepository = repositoriesFactory.createPagesRepository();
    var _projectsRepository = repositoriesFactory.createProjectsRepository();
    var _websitesRepository = repositoriesFactory.createWebsitesRepository();

    this.getData = function(successAction, errorAction) {

      return q
        .all([
          getWebsiteProperties(),
          getPageByName(),
          getBasicPages(),
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
          function(properties) {
            deferred.resolve(properties);
          },
          function(e) {
            _base.addErrors(e);
            deferred.reject();
          }, true);

        return deferred.promise;
      }

      function getPageByName() {
        var deferred = q.defer();

        _pagesRepository.getPageByName(_base.currentView, function(page) {
          deferred.resolve(page);
        }, function(e) {
          _base.addErrors(e);
          deferred.reject();
        }, true);

        return deferred.promise;
      }

      function getBasicPages() {
        var deferred = q.defer();

        _pagesRepository.getBasicPages(function(pages) {
          deferred.resolve(pages);
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
          function(project) {
            deferred.resolve(project);
          },
          function(e) {
            _base.addErrors(e);
            deferred.reject();
          }, true);

        return deferred.promise;
      }

      function computeData(properties, page, pages, project) {
        var data = _base.getPageData({
          website: properties,
          page: page,
          allPages: pages
        });

        data.project = {
          title: project.title,
          shortTite: project.title_short,
          description: project.description_short,
          name: project.name,
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
