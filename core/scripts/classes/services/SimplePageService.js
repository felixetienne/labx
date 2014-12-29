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
          getPageByName()
        ])
        .spread(computeData)
        .then(onSuccess)
        .fail(onError)
        .done();

      function onSuccess(data) {
        successAction(data, context);
      }

      function onError() {
        errorAction(_base.getErrors(), context);
      }

      function getPageByName() {
        var deferred = q.defer();
        var page = _base.getCurrentPage();
        var repo = _base.getPagesRepository();

        repo.getPageByName(page, function(x) {
          deferred.resolve(x);
        }, function() {
          addErrors(repo.getErrors());
          addError(new Error('Page "' + page + '" not found', 404));
          deferred.reject();
        });

        return deferred.promise;
      }

      function computeData(website, menuPages,
        menuProjectCategories, page) {
        var data = _base.getPageData({
          website: website,
          menuPages: menuPages,
          menuProjectCategories: menuProjectCategories
        });

        data.page = {
          title: page.title || '',
          descriptionHtml: page.description_html || '',
          keywords: page.keywords || '',
          docTitle: _base.getDocTitle(page, website),
          docDescription: page.doc_description || page.description_short ||
            '',
          docKeywords: _base.getDocKeywords(page, website)
        };

        return data;
      }
    }
  }

})(require('q'),
  require('dateformat'),
  require('./BasePageService'),
  require('../Error'));
