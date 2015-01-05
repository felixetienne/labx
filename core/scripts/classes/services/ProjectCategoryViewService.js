(function(q, cache, BaseViewService, Error) {

  module.exports = function(context) {
    var _base = new BaseViewService(context);

    this.getData = function(successAction, errorAction) {

      return q
        .all([
          _base.getWebsite(),
          _base.getPages(),
          _base.getMenuEvents(),
          _base.getMenuProjectCategories(),
          _base.getFeaturedProjects(),
          _base.getImageBanners(),
          getProjectCategory()
        ])
        .spread(computeData)
        .then(onSuccess)
        .fail(onError)
        .done();

      function getProjectCategory() {
        var deferred = q.defer();
        var cacheKey = 'projectCategory';

        _base.getFromCache(cacheKey, function(value) {
          if (value !== null) {
            deferred.resolve(value[cacheKey]);
            return;
          }

          var request = _base.getCurrentRequest();
          var repo = _base.getProjectCategoriesRepository();

          repo.getProjectCategoryByName(request.params.name,
            function(x) {
              _base.addToCache(cacheKey, x, function() {
                deferred.resolve(x);
              });
            },
            function() {
              _base.addErrors(repo.getErrors());
              _base.addError(new Error(
                'Projet category not found', 404));
              deferred.reject();
            });
        });

        return deferred.promise;
      }

      function onSuccess(data) {
        successAction(data, context, _base.getErrors());
      }

      function onError() {
        errorAction(context, _base.getErrors());
      }

      function computeData(website, pages, menuEvents,
        menuProjectCategories, featuredProjects, imageBanners,
        projectCategory) {
        var data = _base.getBasicViewData({
          website: website,
          pages: pages,
          menuEvents: menuEvents,
          menuProjectCategories: menuProjectCategories,
          featuredProjects: featuredProjects,
          imageBanners: imageBanners
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
            url: _base.buildProjectUrl(category.project_name),
            images: category.project_images
          };

          data.projects.push(project);
        }

        return data;
      }
    }
  }

})(
  require('q'),
  require('../../modules/appCache'),
  require('./BaseViewService'),
  require('../Error'));
