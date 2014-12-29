(function(q, dateFormat, BasePageService, Error) {

  module.exports = function(context, repositoriesFactory, viewHelpers) {
    var _base = new BasePageService(context, repositoriesFactory,
      viewHelpers, dateFormat);
    var _projectPage = viewHelpers.getProjectPage();

    this.getData = function(successAction, errorAction) {

      return q
        .all([
          _base.getWebsiteProperties(),
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
        menuProjectCategories, projectsCategory) {
        var data = _base.getPageData({
          website: website,
          menuPages: menuPages,
          menuProjectCategories: menuProjectCategories
        });

        var category = getCategory(projectsCategory, website);
        console.log(category);
        data.page = category.page;
        data.projects = category.projects;

        return data;
      }

      function getCategory(projectsCategory, website) {
        var data = {
          projects: []
        };

        for (var i = 0; i < projectsCategory.length; i++) {
          var category = projectsCategory[i];
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
            url: buildProjectUrl(category.project_name)
          };

          data.projects.push(project);
        }

        return data;
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
