(function(q, dateFormat, BasePageService, Error) {

  module.exports = function(context, repositoriesFactory, viewHelpers) {
    var _base = new BasePageService(context, repositoriesFactory,
      viewHelpers, dateFormat);

    this.getData = function(successAction, errorAction) {

      return q
        .all([
          _base.getWebsiteProperties(),
          _base.getPageByName(),
          _base.getMenuPages(),
          _base.getMenuProjectCategories()
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

      function computeData(website, page, menuPages,
        menuProjectCategories) {
        var data = _base.getPageData({
          website: website,
          page: page,
          menuPages: menuPages,
          menuProjectCategories: menuProjectCategories
        });

        return data;
      }
    }
  }

})(require('q'),
  require('dateformat'),
  require('./BasePageService'),
  require('../Error'));
