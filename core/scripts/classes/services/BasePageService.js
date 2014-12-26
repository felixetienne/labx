(function(q, Error) {

  module.exports = function(context, repositoriesFactory, viewHelpers,
    dateFormat) {
    var _currentPage = context.getCurrentPage();
    var _currentRequest = context.getCurrentRequest();
    var _pagesRepository = repositoriesFactory.createPagesRepository();
    var _websitesRepository = repositoriesFactory.createWebsitesRepository();
    var _projectCategoriesRepository = repositoriesFactory.createProjectCategoriesRepository();
    var _projectPage = viewHelpers.getIndexPage();
    var _errors = [];

    this.getProjectsRepository = function() {
      return _projectsRepository;
    }

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
        function() {
          addErrors(_websitesRepository.getErrors());
          addError(new Error('Website not found', 404));
          deferred.reject();
        });

      return deferred.promise;
    }

    this.getPageByName = function() {
      var deferred = q.defer();

      _pagesRepository.getPageByName(_currentPage, function(x) {
        deferred.resolve(x);
      }, function() {
        addErrors(_pagesRepository.getErrors());
        addError(new Error('Page "' + _currentPage +
          '" not found',
          404));
        deferred.reject();
      });

      return deferred.promise;
    }

    this.getMenuPages = function() {
      var deferred = q.defer();

      _pagesRepository.getMenuPages(function(x) {
        deferred.resolve(x);
      }, function() {
        addErrors(_pagesRepository.getErrors());
        addError(new Error('Page menu not found', 404));
        deferred.reject();
      });

      return deferred.promise;
    }

    this.getMenuProjectCategories = function() {
      var deferred = q.defer();

      _projectCategoriesRepository.getMenuProjectCategories(function(x) {
        deferred.resolve(x);
      }, function() {
        addErrors(_projectCategoriesRepository.getErrors());
        addError(new Error('Project category menu not found',
          404));
        deferred.reject();
      });

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
        menuPages: [],
        menuProjectCategories: []
      };

      for (k in x.menuPages) {
        if (!x.menuPages.hasOwnProperty(k)) continue;
        var page = x.menuPages[k];

        data.menuPages.push({
          title: page.title_short,
          description: page.description_short,
          isCurrent: page.name === _currentPage,
          url: buildPageUrl(page)
        });
      }

      for (k in x.menuProjectCategories) {
        if (!x.menuProjectCategories.hasOwnProperty(k)) continue;
        var projectCategory = x.menuProjectCategories[k];

        data.menuProjectCategories.push({
          title: projectCategory.title,
          url: buildProjectCategoryUrl(projectCategory)
        });
      }

      return data;
    }

    this.getErrors = function() {
      return _errors;
    }

    this.addErrors = function(errors) {
      addErrors(errors);
      return this;
    }

    this.addError = function(error) {
      addError(error);
      return this;
    }

    function addErrors(errors) {
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

    function buildPageUrl(page) {
      if (page.name === viewHelpers.getProjectPage()) return null;

      var url = '/';

      if (page.name === viewHelpers.getIndexPage()) return url;

      return url + page.name;
    }

    function buildProjectCategoryUrl(projectCategory) {
      var url = '/' + _projectPage + '/' + projectCategory.name;

      return url;
    }
  }

})(
  require('q'),
  require('../Error'));
