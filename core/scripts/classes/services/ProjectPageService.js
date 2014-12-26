(function(q, dateFormat, BasePageService, Error) {

  module.exports = function(context, repositoriesFactory, viewHelpers) {
    var _base = new BasePageService(context, repositoriesFactory,
      viewHelpers, dateFormat);
    var _projectsRepository = repositoriesFactory.createProjectsRepository();

    this.getData = function(successAction, errorAction) {

      return q
        .all([
          _base.getWebsiteProperties(),
          _base.getPageByName(),
          _base.getMenuPages(),
          getProjectByName()
        ])
        .spread(computeData)
        .then(onSuccess)
        .fail(onError)
        .done();

      function getProjectByName() {
        var deferred = q.defer();

        _projectsRepository.getProjectByName(_base.getCurrentRequest().params
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

      function onSuccess(data) {
        successAction(data, context);
      }

      function onError() {
        errorAction(_base.getErrors(), context);
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
          date: project.date ? dateFormat(project.date) : null,
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
  require('dateformat'),
  require('./BasePageService'),
  require('../Error'));
