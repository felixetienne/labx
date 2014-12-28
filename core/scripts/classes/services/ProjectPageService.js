(function(q, dateFormat, BasePageService, Error) {

  module.exports = function(context, repositoriesFactory, viewHelpers) {
    var _base = new BasePageService(context, repositoriesFactory,
      viewHelpers, dateFormat);

    this.getData = function(successAction, errorAction) {

      return q
        .all([
          _base.getWebsiteProperties(),
          _base.getPageByName(),
          _base.getMenuPages(),
          _base.getMenuProjectCategories(),
          getProjectByName()
        ])
        .spread(computeData)
        .then(onSuccess)
        .fail(onError)
        .done();

      function getProjectByName() {
        var deferred = q.defer();
        var repo = repositoriesFactory.createProjectsRepository();

        repo.getProjectByName(_base.getCurrentRequest().params
          .name,
          function(x) {
            deferred.resolve(x);
          },
          function() {
            _base.addErrors(repo.getErrors());
            _base.addError(new Error('Projet not found', 404));
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

      function computeData(website, page, menuPages,
        menuProjectCategories, project) {
        var data = _base.getPageData({
          website: website,
          page: page,
          menuPages: menuPages,
          menuProjectCategories: menuProjectCategories
        });

        data.page.docTitle = project.title;
        data.page.title = project.title;
        data.page.description = project.description;

        data.projectCategory = {
          date: _base.formatDate(project.date),
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
