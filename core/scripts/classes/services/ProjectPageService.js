(function(q, dateFormat, BasePageService, Error) {

  module.exports = function(context, repositoriesFactory, viewHelpers) {
    var _base = new BasePageService(context, repositoriesFactory,
      viewHelpers, dateFormat);

    this.getData = function(successAction, errorAction) {

      return q
        .all([
          _base.getWebsiteProperties(),
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
        var data = _base.getPageData({
          website: website,
          menuPages: menuPages,
          menuProjectCategories: menuProjectCategories
        });

        data.page = {
          title: project.title || '',
          descriptionHtml: project.description_html || '',
          keywords: getKeywords(project),
          docTitle: _base.getDocTitle(project, website),
          docDescription: project.doc_description || project.description_short ||
            '',
          docKeywords: _base.getDocKeywords(project, website)
        };

        data.projectCategory = {
          date: _base.formatDate(project.date),
          category: project.category_title || '',
          image: {
            title: project.image_title || '',
            url: project.image_path || ''
          }
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
  require('./BasePageService'),
  require('../Error'));
