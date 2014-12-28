(function(q, dateFormat, BasePageService, Error) {

  module.exports = function(context, repositoriesFactory, viewHelpers) {
    var _base = new BasePageService(context, repositoriesFactory,
      viewHelpers, dateFormat);
    var _projectPage = viewHelpers.getProjectPage();

    this.getData = function(successAction, errorAction) {

      return q
        .all([
          _base.getWebsiteProperties(),
          _base.getPageByName(),
          _base.getMenuPages(),
          _base.getMenuProjectCategories(),
          getProjectsByCategoryName()
        ])
        .spread(computeData)
        .then(onSuccess)
        .fail(onError)
        .done();

      function getProjectsByCategoryName() {
        var deferred = q.defer();
        var repo = _base.getProjectCategoriesRepository();

        repo.getProjectCategoryByName(_base.getCurrentRequest().params
          .name,
          function(x) {
            deferred.resolve(x);
          },
          function() {
            _base.addErrors(repo.getErrors());
            _base.addError(new Error('Projet category not found', 404));
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
        menuProjectCategories, projectCategory) {
        var data = _base.getPageData({
          website: website,
          page: page,
          menuPages: menuPages,
          menuProjectCategories: menuProjectCategories
        });

        var category = getCategory(projectCategory);

        data.page.docTitle = category.title;
        data.page.title = category.title;
        data.page.description = category.description;
        data.projects = category.projects;

        return data;
      }

      function getCategory(projectCategoryResults) {
        var category = {
          projects: []
        };

        for (var i = 0; i < projectCategoryResults.length; i++) {
          var result = projectCategoryResults[i];
          if (i === 0) {
            category.title = result.title;
            category.description = result.description;
          }

          var project = {
            title: result.project_title_short,
            description: result.project_description_short,
            date: _base.formatDate(result.project_date),
            url: buildProjectUrl(result.project_name)
          };

          category.projects.push(project);
        }

        return category;
      }
    }

    function buildProjectUrl(projectName) {
      var url = '/' + _projectPage + '/' + projectName;

      return url;
    }
  }

})(
  require('q'),
  require('dateformat'),
  require('./BasePageService'),
  require('../Error'));
