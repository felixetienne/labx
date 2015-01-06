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
          _base.getPage(),
          getProjectCategories()
        ])
        .spread(computeData)
        .then(onSuccess)
        .fail(onError)
        .done();

      function getProjectCategories() {
        var deferred = q.defer();
        var cacheKey = 'projectCategories';

        _base.getFromCache(cacheKey, function(value) {
          if (value !== null) {
            deferred.resolve(value);
            return;
          }

          var repo = _base.getProjectCategoriesRepository();

          repo.getAllProjectCategories(function(x) {
              _base.addToCache(cacheKey, x, function() {
                deferred.resolve(x);
              });
            },
            function() {
              _base.addErrors(repo.getErrors());
              _base.addError(new Error('Projets not found', 404));
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
        menuProjectCategories, featuredProjects, imageBanners, page,
        projectCategories) {
        var data = _base.getBasicViewData({
          website: website,
          pages: pages,
          menuEvents: menuEvents,
          menuProjectCategories: menuProjectCategories,
          featuredProjects: featuredProjects,
          imageBanners: imageBanners
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
            url: _base.buildProjectUrl(category.project_name),
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
  require('../../modules/appCache'),
  require('./BaseViewService'),
  require('../Error'));
