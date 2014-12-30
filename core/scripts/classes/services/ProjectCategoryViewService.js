(function(q, dateFormat, BaseViewService, BaseProjectsViewService, Error) {

  module.exports = function(context, repositoriesFactory, viewHelpers) {
    var _base = new BaseViewService(context, repositoriesFactory,
      viewHelpers, dateFormat);
    var _baseProjects = new BaseProjectsViewService(viewHelpers);

    this.getData = function(successAction, errorAction) {

      return q
        .all([
          _base.getWebsite(),
          _base.getMenuPages(),
          _base.getMenuProjectCategories(),
          getProjectCategory()
        ])
        .spread(computeData)
        .then(onSuccess)
        .fail(onError)
        .done();

      function getProjectCategory() {
        var deferred = q.defer();
        var request = _base.getCurrentRequest();
        var repo = _base.getProjectCategoriesRepository();

        repo.getProjectCategoryByName(request.params.name,
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

      function computeData(website, menuPages,
        menuProjectCategories, projectCategory) {
        var data = _base.getBasicViewData({
          website: website,
          menuPages: menuPages,
          menuProjectCategories: menuProjectCategories
        });

        var viewData = getViewData(projectCategory, website);
        data.page = viewData.page;
        data.projects = viewData.projects;

        return data;
      }

      function getViewData(projectCategory, website) {
        var data = {
          projects: []
        };

        for (var i = 0; i < projectCategory.length; i++) {
          var category = projectCategory[i];
          if (i === 0) {
            data.page = {
              title: category.title || '',
              descriptionHtml: category.description_html || '',
              keywords: category.keywords || '',
              docTitle: _base.getDocTitle(category, website),
              docDescription: category.doc_description ||
                category.description_short || '',
              docKeywords: _base.getDocKeywords(category, website)
            };
          }

          var project = {
            title: category.project_title_short ||
              category.project_title || '',
            description: category.project_description_short,
            date: _base.formatDate(category.project_date),
            url: _baseProjects.buildUrl(category.project_name)
          };

          data.projects.push(project);
        }

        return data;
      }
    }
  }

})(
  require('q'),
  require('dateformat'),
  require('./BaseViewService'),
  require('./BaseProjectsViewService'),
  require('../Error'));