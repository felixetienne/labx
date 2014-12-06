(function(q, BasePageService){

    module.exports = function (context, repositoriesFactory){
        var _base = new BasePageService(context);
        var _pagesRepository = repositoriesFactory.createPagesRepository();
        var _websitesRepository = repositoriesFactory.createWebsitesRepository();

        this.getData = function(successAction, errorAction){

            return q
            .all([
                getWebsiteProperties(),
                getPageByName(),
                getBasicPages()
            ])
            .spread(computeData)
            .then(successAction)
            .fail(errorAction)
            .done();

            function getWebsiteProperties() {
                var deferred = q.defer();

                _websitesRepository.getWebsiteProperties(context.getCurrentWebsiteName(), function(x){
                    deferred.resolve(x);
                }, function() {
                    deferred.reject(_base.getEmptyResultError());
                });

                return deferred.promise;
            }

            function getPageByName() {
                var deferred = q.defer();

                _pagesRepository.getPageByName(_base.currentView, function(x){
                    deferred.resolve(x);
                }, function() {
                    deferred.reject(_base.getEmptyResultError());
                });

                return deferred.promise;
            }

            function getBasicPages() {
                var deferred = q.defer();

                _pagesRepository.getBasicPages(function(x){
                    deferred.resolve(x);
                }, function() {
                    deferred.reject(_base.getEmptyResultError());
                });

                return deferred.promise;
            }

            function computeData(properties, page, pages) {
                var data = _base.getPageData({
                    website: properties,
                    page: page,
                    allPages: pages
                });

                return data;
            }
        }
    }

})(require('q'),
   require('./BasePageService'));
