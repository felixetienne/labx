(function(q) {

  module.exports = function(context, repositoriesFactory, viewHelpers,
    dateFormat) {
    var _currentPage = context.getCurrentPage();
    var _currentRequest = context.getCurrentRequest();
    var _pagesRepository = repositoriesFactory.createPagesRepository();
    var _websitesRepository = repositoriesFactory.createWebsitesRepository();
    var _errors = [];

    this.getCurrentPage = function() {
      return _currentPage;
    }

    this.getCurrentRequest = function() {
      return _currentRequest;
    }

    this.getWebsiteProperties = function() {
      var deferred = q.defer();

      _websitesRepository.getWebsiteProperties(context.getCurrentWebsiteName(),
        function(x) {
          deferred.resolve(x);
        },
        function(e) {
          this.addErrors(e);
          deferred.reject();
        }, true);

      return deferred.promise;
    }

    this.getPageByName = function() {
      var deferred = q.defer();

      _pagesRepository.getPageByName(_currentPage, function(
        x) {
        deferred.resolve(x);
      }, function(e) {
        this.addErrors(e);
        deferred.reject();
      }, true);

      return deferred.promise;
    }

    this.getMenuPages = function() {
      var deferred = q.defer();

      _pagesRepository.getMenuPages(function(x) {
        deferred.resolve(x);
      }, function(e) {
        this.addErrors(e);
        deferred.reject();
      }, true);

      return deferred.promise;
    }

    this.getPageData = function(x) {
      var data = {
        website: {
          date: dateFormat(x.website.date || Date.now(), 'dd/mm/yyyy'),
          title: x.website.title || '',
          subtitle: x.website.subtitle || '',
          copyright: x.website.copyright || '',
          version: x.website.version || '',
          author: x.website.author || ''
        },
        page: {
          docTitle: x.page.doc_title || '',
          docDescription: x.page.doc_description || '',
          docKeywords: x.page.doc_keywords || '',
          title: x.page.title,
          description: x.page.description
        },
        menuPages: []
      };

      for (k in x.menuPages) {
        if (!x.menuPages.hasOwnProperty(k)) continue;

        var page = x.menuPages[k];

        data.menuPages.push({
          title: page.title_short,
          description: page.description_short,
          isCurrent: page.name === _currentPage,
          url: buildUrl(page)
        });
      }

      return data;
    }

    this.getErrors = function() {
      return _errors;
    }

    this.addErrors = function(errors) {
      if (!errors) return;
      if (errors instanceof Array) {
        for (var i = 0; i < errors.length; i++) {
          addError(errors[i]);
        }
      } else {
        addError(errors);
      }
    }

    function addError(error) {
      _errors.push(error);
    }

    function buildUrl(page) {
      var url = '/';

      if (page.name === viewHelpers.getIndexPage()) return url;

      url += page.name;

      // temporary for test
      if (page.name !== viewHelpers.getProjectPage()) return url;
      return url += '/faces';
    }
  }

})(require('q'));
