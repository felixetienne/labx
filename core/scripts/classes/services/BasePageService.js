(function(q, Error) {

  module.exports = function(context, repositoriesFactory, viewHelpers,
    dateFormat) {
    var _dateFormat = 'dd/mm/yyyy';
    var _currentPage = context.getCurrentPage();
    var _currentRequest = context.getCurrentRequest();
    var _currentNameParam = _currentRequest.params ? _currentRequest.params
      .name : null;
    var _websitesRepository = null;
    var _pagesRepository = null;
    var _projectsRepository = null;
    var _projectCategoriesRepository = null;
    var _projectsPage = viewHelpers.getProjectsPage();
    var _errors = [];

    function getWebsitesRepository() {
      if (_websitesRepository === null) {
        _websitesRepository = repositoriesFactory.createWebsitesRepository();
      }
      return _websitesRepository;
    }

    function getProjectCategoriesRepository() {
      if (_projectCategoriesRepository === null) {
        _projectCategoriesRepository = repositoriesFactory.createProjectCategoriesRepository();
      }
      return _projectCategoriesRepository;
    }

    function getProjectsRepository() {
      if (_projectsRepository === null) {
        _projectsRepository = repositoriesFactory.createProjectsRepository();
      }
      return _projectsRepository;
    }

    function getPagesRepository() {
      if (_pagesRepository === null) {
        _pagesRepository = repositoriesFactory.createPagesRepository();
      }
      return _pagesRepository;
    }

    this.getWebsitesRepository = getWebsitesRepository;

    this.getProjectCategoriesRepository = getProjectCategoriesRepository;

    this.getProjectsRepository = getProjectsRepository;

    this.getPagesRepository = getPagesRepository;

    this.formatDate = formatDate;

    this.addErrors = addErrors;

    this.addError = addError;

    this.getErrors = function() {
      return _errors;
    }

    this.getCurrentPage = function() {
      return _currentPage;
    }

    this.getCurrentRequest = function() {
      return _currentRequest;
    }

    this.getWebsiteProperties = function() {
      var deferred = q.defer();
      var repo = getWebsitesRepository();

      repo.getWebsiteProperties(context.getCurrentWebsiteName(),
        function(x) {
          deferred.resolve(x);
        },
        function() {
          addErrors(repo.getErrors());
          addError(new Error('Website not found', 404));
          deferred.reject();
        });

      return deferred.promise;
    }

    this.getMenuPages = function() {
      var deferred = q.defer();
      var repo = getPagesRepository();

      repo.getMenuPages(function(x) {
        deferred.resolve(x);
      }, function() {
        addErrors(repo.getErrors());
        addError(new Error('Page menu not found', 404));
        deferred.reject();
      });

      return deferred.promise;
    }

    this.getMenuProjectCategories = function() {
      var deferred = q.defer();
      var repo = getProjectCategoriesRepository();

      repo.getMenuProjectCategories(function(x) {
        deferred.resolve(x);
      }, function() {
        addErrors(repo.getErrors());
        addError(new Error('Project category menu not found', 404));
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
          author: x.website.author || '',
          docAuthor: x.website.doc_author || x.website.author || '',
          docLanguage: x.website.doc_language || ''
        },
        menuPages: getMenuPagesData(x)
      };

      return data;
    }

    this.getDocTitle = function(page, website) {
      var pageTitle = page.doc_title || page.title || '';

      if (!pageTitle.length) return website.title;

      var titleFormat = website.doc_titleFormat || '';

      if (!titleFormat.length) return pageTitle;

      return titleFormat.replace('{pageTitle}', pageTitle);
    }

    this.getDocKeywords = function(page, website) {
      var keywords = page.doc_keywords || page.keywords || '';
      if (website.doc_keywords) {
        if (keywords.length) {
          keywords += ',';
        }
        keywords += website.doc_keywords;
      }

      return keywords;
    }

    function formatDate(date) {
      if (!date) return null;

      return dateFormat(date, _dateFormat);
    }

    function getMenuPagesData(x) {
      var menuPages = [];

      for (k in x.menuPages) {
        if (!x.menuPages.hasOwnProperty(k)) continue;
        var menuPage = x.menuPages[k];
        var isCurrent = isCurrentPage(menuPage.name);

        menuPages.push({
          title: menuPage.title_short || menuPage.title || '',
          isCurrent: isCurrent,
          url: buildPageUrl(menuPage),
          subMenuPages: getSubMenuPagesData(menuPage.name, isCurrent,
            x)
        });
      }

      return menuPages;
    }

    function getSubMenuPagesData(menuPageName, isCurrent, x) {
      var menuPages = [];

      if (menuPageName === viewHelpers.getProjectsPage()) {
        for (k in x.menuProjectCategories) {
          if (!x.menuProjectCategories.hasOwnProperty(k)) continue;
          var projectCategory = x.menuProjectCategories[k];
          var menuPage = {
            title: projectCategory.title_short || projectCategory.title ||
              '',
            isCurrent: isCurrentSubPage(isCurrent, projectCategory.name),
            url: buildProjectCategoryUrl(projectCategory)
          };

          menuPages.push(menuPage);
        }

        menuPages.push(getAllProjectsMenuPage());
      }

      return menuPages;
    }

    function getAllProjectsMenuPage() {
      var currentPageIsProjects = _currentPage === viewHelpers.getProjectsPage();
      var menuPage = {
        title: 'Tout les projets',
        isCurrent: currentPageIsProjects,
        url: getProjectsPageUrl()
      };

      return menuPage;
    }

    function isCurrentPage(pageName) {
      return _currentPage === pageName;
    }

    function isCurrentSubPage(parentIsCurrent, subPageName) {
      if (!parentIsCurrent) return false;

      return subPageName === _currentNameParam;
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
