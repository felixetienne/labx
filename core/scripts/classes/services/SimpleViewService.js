(function(q, cache, BaseViewService, Error) {

  module.exports = function(context) {
    var _base = new BaseViewService(context);

    this.getData = function(client, successAction, errorAction) {

      return q
        .all([
          _base.getWebsite(client),
          _base.getPages(client),
          _base.getMenuEvents(client),
          _base.getMenuProjectCategories(client),
          _base.getFeaturedProjects(client),
          _base.getImageBanners(client),
          _base.getPage(client)
        ])
        .spread(computeData)
        .then(onSuccess)
        .fail(onError)
        .done();

      function onSuccess(data) {
        successAction(data, context, _base.getErrors());
      }

      function onError() {
        errorAction(context, _base.getErrors());
      }

      function computeData(website, pages, menuEvents,
        menuProjectCategories, featuredProjects, imageBanners, page) {
        var data = _base.getBasicViewData({
          website: website,
          pages: pages,
          menuEvents: menuEvents,
          menuProjectCategories: menuProjectCategories,
          featuredProjects: featuredProjects,
          imageBanners: imageBanners
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
  require('../../modules/appCache'),
  require('./BaseViewService'),
  require('../Error'));
