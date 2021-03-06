(function(q, cache, BaseViewService, Error) {

  module.exports = function(context) {
    var _base = new BaseViewService(context);

    this.getData = function(successAction, errorAction) {

      _base.initializeClient(function() {

        return q
          .all([
            _base.getWebsite(),
            _base.getPages(),
            _base.getMenuEvents(),
            _base.getMenuProjectCategories(),
            _base.getFeaturedProjects(),
            _base.getImageBanners(),
            _base.getPage()
          ])
          .spread(computeData)
          .then(onSuccess)
          .fail(onError)
          .done(_base.onComplete);

        function onSuccess(data) {
          successAction(data, context, _base.getErrors());
        }

        function onError() {
          errorAction(context, _base.getErrors());
        }

        function computeData(website, pages, menuEvents,
          menuProjectCategories, featuredProjects, imageBanners,
          page) {
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
      });
    }
  }

})(require('q'),
  require('../../modules/appCache'),
  require('./BaseViewService'),
  require('../Error'));
