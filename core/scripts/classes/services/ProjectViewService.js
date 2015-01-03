(function(q, dateFormat, BaseViewService, BaseProjectsViewService, Error) {

  module.exports = function(context, repositoriesFactory, viewHelpers) {
    var _base = new BaseViewService(context, repositoriesFactory,
      viewHelpers, dateFormat);
    var _baseProject = new BaseProjectsViewService(viewHelpers);

    this.getData = function(successAction, errorAction) {

      return q
        .all([
          _base.getWebsite(),
          _base.getPages(),
          _base.getMenuEvents(),
          _base.getMenuProjectCategories(),
          _base.getImageBanners(),
          getProject()
        ])
        .spread(computeData)
        .then(onSuccess)
        .fail(onError)
        .done();

      function getProject() {
        var deferred = q.defer();
        var request = _base.getCurrentRequest();
        var repo = _base.getProjectsRepository();

        repo.getProjectByName(request.params.name,
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

      function computeData(website, pages, menuEvents,
        menuProjectCategories, imageBanners, project) {
        var data = _base.getBasicViewData({
          website: website,
          pages: pages,
          menuEvents: menuEvents,
          menuProjectCategories: menuProjectCategories,
          imageBanners: imageBanners
        });

        var viewData = getViewData(project, website);
        data.page = viewData.page;
        data.project = viewData.project;

        for (var i = 0; i < viewData.projectBreadcrumbPages.length; i++) {
          data.breadcrumbPages.push(viewData.projectBreadcrumbPages[i]);
        }

        return data;
      }

      function getViewData(project, website) {
        var data = {
          projectBreadcrumbPages: []
        };

        data.page = {
          title: project.title || '',
          descriptionHtml: project.description_html || '',
          keywords: getKeywords(project),
          docTitle: _base.getDocTitle(project, website),
          docDescription: project.doc_description || project.description_short ||
            '',
          docKeywords: _base.getDocKeywords(project, website)
        };

        data.project = {
          date: _base.formatDate(project.date),
          category: project.category_title || '',
          images: project.images,
          medias: project.medias
        };

        var categoryBreadcrumbPage = {
          title: project.category_title_short || project.category_title ||
            '',
          url: _base.buildProjectCategoryUrl(project.category_name)
        };

        var projectBreadcrumbPage = {
          title: project.title_short || project.title || '',
          url: _baseProject.buildUrl(project.name)
        };

        data.projectBreadcrumbPages.push(categoryBreadcrumbPage);
        data.projectBreadcrumbPages.push(projectBreadcrumbPage);

        return data;
      }

      function getKeywords(project) {
        var keywords = project.keywords || '';
        if (project.category_keywords) {
          if (keywords.length) {
            keywords += ',';
          }
          keywords += project.category_keywords;
        }
        return keywords;
      }
    }
  }

})(
  require('q'),
  require('dateformat'),
  require('./BaseViewService'),
  require('./BaseProjectViewService'),
  require('../Error'));
