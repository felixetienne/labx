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
          _base.getMenuEvents(),
          _base.getMenuProjectCategories(),
          _base.getPage(),
          getProjectCategories()
        ])
        .spread(computeData)
        .then(onSuccess)
        .fail(onError)
        .done();

      function getProjectCategories() {
        var deferred = q.defer();
        var repo = _base.getProjectCategoriesRepository();

        repo.getAllProjectCategories(function(x) {
            deferred.resolve(x);
          },
          function() {
            _base.addErrors(repo.getErrors());
            _base.addError(new Error('Projets not found', 404));
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

      function computeData(website, menuPages, menuEvents,
        menuProjectCategories, page, projectCategories) {
        var data = _base.getBasicViewData({
          website: website,
          menuPages: menuPages,
          menuEvents: menuEvents,
          menuProjectCategories: menuProjectCategories
        });

        var viewData = getViewData(page, projectCategories, website);
        data.page = viewData.page;
        data.projectCategories = viewData.projectCategories;

        return data;
      }

      function getViewData(page, projectCategories, website) {
        var data = {
          page: _base.getStandardPageData(page, website),
          projectCategories: []
        };
        var lastCategoryId = null;

        for (var i = 0; i < projectCategories.length; i++) {
          var category = projectCategories[i];

          if (category.id !== lastCategoryId) {
            var projectCategory = {
              title: category.title_short || category.title || '',
              description: category.description_short || '',
              url: _base.buildProjectCategoryUrl(category.name),
              projects: []
            };

            data.projectCategories.push(projectCategory);

            lastCategoryId = category.id;
          }

          var project = {
            title: category.project_title_short || category.project_title ||
              '',
            description: category.project_description_short || '',
            date: _base.formatDate(category.project_date),
            url: _baseProjects.buildUrl(category.project_name),
            images: category.project_images
          };

          data.projectCategories[data.projectCategories.length - 1].projects
            .push(project);
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
