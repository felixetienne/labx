(function(q, Error) {

  module.exports = function(
    context, repositoriesFactory, viewHelpers, dateFormat) {
    var _dateFormat = 'dd/mm/yyyy';
    var _currentPage = context.getCurrentPage();
    var _currentRequest = context.getCurrentRequest();
    var _currentNameParam = _currentRequest.params ?
      _currentRequest.params.name : null;
    var _websitesRepository = null;
    var _imagesRepository = null;
    var _pagesRepository = null;
    var _eventsRepository = null;
    var _projectsRepository = null;
    var _projectCategoriesRepository = null;
    var _projectsPage = viewHelpers.getProjectsPage();
    var _projectPage = viewHelpers.getProjectPage();
    var _eventsPage = viewHelpers.getEventsPage();
    var _eventPage = viewHelpers.getEventPage();
    var _homePage = viewHelpers.getIndexPage();
    var _errors = [];

    function getWebsitesRepository() {
      if (_websitesRepository === null) {
        _websitesRepository = repositoriesFactory.createWebsitesRepository();
      }
      return _websitesRepository;
    }

    function getImagesRepository() {
      if (_imagesRepository === null) {
        _imagesRepository = repositoriesFactory.createImagesRepository();
      }
      return _imagesRepository;
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

    function getEventsRepository() {
      if (_eventsRepository === null) {
        _eventsRepository = repositoriesFactory.createEventsRepository();
      }
      return _eventsRepository;
    }

    function getPagesRepository() {
      if (_pagesRepository === null) {
        _pagesRepository = repositoriesFactory.createPagesRepository();
      }
      return _pagesRepository;
    }

    this.getWebsitesRepository = getWebsitesRepository;
    this.getImagesRepository = getImagesRepository;
    this.getProjectCategoriesRepository = getProjectCategoriesRepository;
    this.getProjectsRepository = getProjectsRepository;
    this.getPagesRepository = getPagesRepository;
    this.getEventsRepository = getEventsRepository;
    this.buildProjectCategoryUrl = buildProjectCategoryUrl;
    this.getDocTitle = getDocTitle;
    this.getDocKeywords = getDocKeywords;
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

    this.getWebsite = function() {
      var deferred = q.defer();
      var repo = getWebsitesRepository();

      repo.getWebsiteByName(context.getCurrentWebsiteName(),
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

    this.getPages = function() {
      var deferred = q.defer();
      var repo = getPagesRepository();

      repo.getAllPages(function(x) {
        deferred.resolve(x);
      }, function() {
        addErrors(repo.getErrors());
        //addError(new Error('Page menu not found', 404));
        deferred.reject();
      });

      return deferred.promise;
    }

    this.getMenuEvents = function() {
      var deferred = q.defer();
      var repo = getEventsRepository();

      repo.getMenuEvents(function(x) {
        deferred.resolve(x);
      }, function() {
        addErrors(repo.getErrors());
        //addError(new Error('Event menu not found', 404));
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
        //addError(new Error('Project category menu not found', 404));
        deferred.reject();
      });

      return deferred.promise;
    }

    this.getPage = function() {
      var deferred = q.defer();
      var repo = getPagesRepository();

      repo.getPageByName(_currentPage, function(x) {
        deferred.resolve(x);
      }, function() {
        addErrors(repo.getErrors());
        addError(new Error('Page "' + page + '" not found', 404));
        deferred.reject();
      });

      return deferred.promise;
    }

    this.getImageBanners = function() {
      var deferred = q.defer();

      if (viewHelpers.hasBanners(_currentPage)) {
        var repo = getImagesRepository();

        repo.getBanners(function(x) {
          deferred.resolve(x);
        }, function() {
          addErrors(repo.getErrors());
          //addError(new Error('Banner "' + page + '" not found', 404));
          deferred.reject();
        });
      } else {
        deferred.resolve([]);
      }

      return deferred.promise;
    }

    this.getBasicViewData = function(x) {
      var navigationData = getNavigationData(x);
      var data = {
        menuPages: navigationData.menuPages,
        footerPages: navigationData.footerPages,
        breadcrumbPages: navigationData.breadcrumbPages,
        lastEvents: navigationData.lastEvents,
        imageBanners: getImageBannersData(x),
        website: {
          date: formatDate(x.website.date || Date.now()),
          title: x.website.title || '',
          subtitle: x.website.subtitle || '',
          copyright: x.website.copyright || '',
          version: x.website.version || '',
          author: x.website.author || '',
          docAuthor: x.website.doc_author ||
            x.website.author || '',
          docLanguage: x.website.doc_language || ''
        }
      };

      return data;
    }

    this.getStandardPageData = function(page, website) {
      var data = {
        title: page.title || '',
        descriptionHtml: page.description_html || '',
        keywords: page.keywords || '',
        docTitle: getDocTitle(page, website),
        docDescription: page.doc_description ||
          page.description_short || '',
        docKeywords: getDocKeywords(page, website)
      };

      return data;
    }

    function getImageBannersData(x) {
      var data = [];

      if (!x.imageBanners) return data;

      for (var i = 0; i < x.imageBanners.length; i++) {
        var imageBanner = x.imageBanners[i];
        var imageBannerData = {
          imagePath: imageBanner.path,
          imageTitle: imageBanner.title,
          contentTitle: imageBanner.project_title ||
            imageBanner.project_title || '',
          contentSubtitle: imageBanner.project_category_title_short ||
            imageBanner.project_category_title || '',
          contentDescription: imageBanner.project_description_short ||
            '',
          contentDate: formatDate(imageBanner.project_date)
        };

        data.push(imageBannerData);
      }

      return data;
    }

    function getDocKeywords(page, website) {
      var keywords = page.doc_keywords || page.keywords || '';
      if (website.doc_keywords) {
        if (keywords.length) {
          keywords += ',';
        }
        keywords += website.doc_keywords;
      }

      return keywords;
    }

    function getDocTitle(page, website) {
      var pageTitle = page.doc_title || page.title || '';

      if (!pageTitle.length) return website.title;

      var titleFormat = website.doc_titleFormat || '';

      if (!titleFormat.length) return pageTitle;

      return titleFormat.replace('{pageTitle}', pageTitle);
    }

    function formatDate(date) {
      if (!date) return null;

      return dateFormat(date, _dateFormat);
    }

    function getNavigationData(x) {
      var data = {
        menuPages: [],
        footerPages: [],
        breadcrumbPages: [],
        lastEvents: []
      };

      for (k in x.pages) {
        if (!x.pages.hasOwnProperty(k)) continue;
        var page = x.pages[k];
        var isCurrent = isCurrentPage(page.name);
        var isHome = isHomePage(page.name);
        var title = page.title_short || page.title || '';
        var url = buildPageUrl(page);

        if (isHome || isCurrent) {
          var breadcrumbPage = {};

          if (page.name === _eventPage) {
            var eventsPage = selectPage(_eventsPage, x.pages);

            if (!eventsPage)
              addError(new Error('Events page does not exists.', 500));

            breadcrumbPage.title = eventsPage.title_short ||
              eventsPage.title || '';
            breadcrumbPage.url = buildPageUrl(eventsPage);

          } else if (page.name === _projectPage) {
            var projectsPage = selectPage(_projectsPage, x.pages);

            if (!projectsPage)
              addError(new Error('Projects page does not exists.', 500));

            breadcrumbPage.title = projectsPage.title_short ||
              projectsPage.title || '';
            breadcrumbPage.url = buildPageUrl(projectsPage);

          } else {
            breadcrumbPage.title = title;
            breadcrumbPage.url = url;
          }

          if (isHome) {
            data.breadcrumbPages.unshift(breadcrumbPage);
          } else {
            data.breadcrumbPages.push(breadcrumbPage);
          }
        }

        var subNavigationData = getSubNavigationData(
          page.name, isCurrent, x);

        if (page.menu || page.footer) {
          var menuPage = {
            url: url,
            title: title,
            isCurrent: isCurrent,
            subMenuPages: subNavigationData.menuPages
          };

          if (page.menu) {
            data.menuPages.push(menuPage);
          }

          if (page.footer) {
            data.footerPages.push(menuPage);
          }
        }

        for (var j = 0; j < subNavigationData.breadcrumbPages.length; j++) {
          data.breadcrumbPages.push(subNavigationData.breadcrumbPages[j]);
        }

        for (var j = 0; j < subNavigationData.lastEvents.length; j++) {
          data.lastEvents.push(subNavigationData.lastEvents[j]);
        }
      }

      return data;
    }

    function getSubNavigationData(pageName, parentIsCurrent, x) {
      var data = {
        menuPages: [],
        breadcrumbPages: [],
        lastEvents: []
      };

      if (pageName === _eventsPage) {

        for (k in x.menuEvents) {
          if (!x.menuEvents.hasOwnProperty(k)) continue;
          var event = x.menuEvents[k];
          var isCurrent = isCurrentSubPage(parentIsCurrent, event.name);
          var title = event.title_short ||
            event.title || '';
          var url = buildEventUrl(event.name)

          if (isCurrent) {
            var breadcrumbPage = {
              url: url,
              title: title
            };

            data.breadcrumbPages.push(breadcrumbPage);

          } else {
            var lastEvent = {
              url: url,
              title: title,
              date: formatDate(event.date)
            };

            data.lastEvents.push(lastEvent);
          }

          var menuPage = {
            url: url,
            title: title,
            isCurrent: isCurrent
          };

          data.menuPages.push(menuPage);
        }

        data.menuPages.push(getAllEventsMenuPage());

      } else if (pageName === _projectsPage) {

        for (k in x.menuProjectCategories) {
          if (!x.menuProjectCategories.hasOwnProperty(k)) continue;
          var projectCategory = x.menuProjectCategories[k];
          var isCurrent = isCurrentSubPage(
            parentIsCurrent, projectCategory.name);
          var title = projectCategory.title_short ||
            projectCategory.title || '';
          var url = buildProjectCategoryUrl(projectCategory.name);

          if (isCurrent) {
            var breadcrumbPage = {
              url: url,
              title: title
            };

            data.breadcrumbPages.push(breadcrumbPage);
          }

          var page = {
            url: url,
            title: title,
            isCurrent: isCurrent
          };

          data.menuPages.push(page);
        }

        data.menuPages.push(getAllProjectsMenuPage());
      }

      return data;
    }

    function selectPage(pageName, pages) {
      for (var i = 0; i < pages.length; i++) {
        var page = pages[i];
        if (page.name === pageName) return page;
      }

      return null;
    }

    function getAllEventsMenuPage() {
      var menuPage = {
        title: 'Tout les evenements',
        isCurrent: false,
        url: '/' + _eventsPage
      };

      return menuPage;
    }

    function getAllProjectsMenuPage() {
      var menuPage = {
        title: 'Tout les projets',
        isCurrent: false,
        url: '/' + _projectsPage
      };

      return menuPage;
    }

    function isHomePage(pageName) {
      return _homePage === pageName;
    }

    function isCurrentPage(pageName) {
      if (_currentPage === _eventPage)
        return pageName === _eventsPage;

      if (_currentPage === _projectPage)
        return pageName === _projectsPage;

      return _currentPage === pageName;
    }

    function isCurrentSubPage(parentIsCurrent, pageName) {
      if (!parentIsCurrent) return false;

      return pageName === _currentNameParam;
    }

    function buildPageUrl(page) {
      if (page.name === _projectPage ||
        page.name === _eventPage) return null;

      var url = '/';

      if (isHomePage(page.name)) return url;

      url += page.name;

      return url;
    }

    function buildEventUrl(eventName) {
      var url = '/' + _eventPage + '/' + eventName;

      return url;
    }

    function buildProjectCategoryUrl(categoryName) {
      var url = '/' + _projectsPage + '/' + categoryName;

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
