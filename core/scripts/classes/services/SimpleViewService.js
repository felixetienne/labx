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
          _base.getPage()
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

      function computeData(website, menuPages,
        menuProjectCategories, page) {
        var data = _base.getBasicViewData({
          website: website,
          menuPages: menuPages,
          menuProjectCategories: menuProjectCategories,
        });

        var viewData = getViewData(page, website);
        data.page = viewData.page;

        return data;
      }

      function getViewData(page, website) {
        var data = {
          page: _base.getStandardPageData(page, website)
        };

        return data;
      }
    }
  }

})(require('q'),
  require('dateformat'),
  require('./BaseViewService'),
  require('../Error'));
