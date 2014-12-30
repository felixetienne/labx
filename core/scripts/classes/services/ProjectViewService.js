(function(q, dateFormat, BaseViewService, Error) {

  module.exports = function(context, repositoriesFactory, viewHelpers) {
    var _base = new BaseViewService(context, repositoriesFactory,
      viewHelpers, dateFormat);

    this.getData = function(successAction, errorAction) {

      return q
        .all([
          _base.getWebsite(),
          _base.getMenuPages(),
          _base.getMenuProjectCategories(),
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

      function computeData(website, menuPages,
        menuProjectCategories, project) {
        var data = _base.getBasicViewData({
          website: website,
          menuPages: menuPages,
          menuProjectCategories: menuProjectCategories
        });

        var viewData = getViewData(project, website);
        data.page = viewData.page;
        data.project = viewData.project;

        return data;
      }

      function getViewData(project, website) {
        var data = {};

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
          images: project.images
        };

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
  require('../Error'));
