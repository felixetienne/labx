(function(q, Error) {

  module.exports = function(context, repositoriesFactory, viewHelpers,
    dateFormat) {
    var _dateFormat = 'dd/mm/yyyy';
    var _currentPage = context.getCurrentPage();
    var _currentRequest = context.getCurrentRequest();
    var _currentNameParam = _currentRequest.params ? _currentRequest.params
      .name : null;
    var _pagesRepository = repositoriesFactory.createPagesRepository();
    var _websitesRepository = repositoriesFactory.createWebsitesRepository();
    var _projectCategoriesRepository = repositoriesFactory.createProjectCategoriesRepository();
    var _projectsPage = viewHelpers.getProjectsPage();
    var _errors = [];

    this.getProjectCategoriesRepository = function() {
      return _projectCategoriesRepository;
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
          date: formatDate(x.website.date || Date.now()),
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
        menuPages: getMenuPagesData(x)
      };

      return data;
    }

    this.formatDate = function(date) {
      return formatDate(date);
    }

    function formatDate(date) {
      if (!date) return null;

      return dateFormat(date, _dateFormat);
    }

    function getMenuPagesData(x) {
      var pages = [];

      for (k in x.menuPages) {
        if (!x.menuPages.hasOwnProperty(k)) continue;
        var page = x.menuPages[k];
        var isCurrent = isCurrentPage(page.name);

        pages.push({
          title: page.title_short,
          description: page.description_short,
          isCurrent: isCurrent,
          url: buildPageUrl(page),
          subMenuPages: getSubMenuPagesData(page.name, isCurrent, x)
        });
      }

      return pages;
    }

    function getSubMenuPagesData(pageName, isCurrent, x) {
      var subPages = [];

      if (pageName === viewHelpers.getProjectsPage()) {
        for (k in x.menuProjectCategories) {
          if (!x.menuProjectCategories.hasOwnProperty(k)) continue;
          var projectCategory = x.menuProjectCategories[k];
          var subPage = {
            title: projectCategory.title,
            url: buildProjectCategoryUrl(projectCategory),
            isCurrent: isCurrentSubPage(isCurrent, projectCategory.name)
          };

          subPages.push(subPage);
        }

        var all = {
          title: 'Tout les projets',
          url: getProjectsPageUrl(),
          isCurrent: currentPageIsProjects()
        };

        subPages.push(all);
      }

      return subPages;
    }

    function isCurrentPage(pageName) {
      return _currentPage === pageName;
    }

    function isCurrentSubPage(parentIsCurrent, subPageName) {
      if (!parentIsCurrent) return false;

      return subPageName === _currentNameParam;
    }

    function currentPageIsProjects() {
      return _currentPage === viewHelpers.getProjectsPage();
    }

    function getProjectsPageUrl() {
      var url = '/';

      return url + viewHelpers.getProjectsPage();
    }

    function buildPageUrl(page) {
      if (page.name === viewHelpers.getProjectPage()) return null;

      var url = '/';

      if (page.name === viewHelpers.getIndexPage()) return url;

      return url + page.name;
    }

    function buildProjectCategoryUrl(projectCategory) {
      var url = '/' + _projectsPage + '/' + projectCategory.name;

      return url;
    }

    function addError(error) {
      _errors.push(error);
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
  }

})(
  require('q'),
  require('../Error'));
