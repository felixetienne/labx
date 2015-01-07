(function(q, dateFormat, repositoriesFactory, config, cache, viewHelpers,
  Error) {

  module.exports = function(context) {
    var _dateFormat = config.getDateFormat();
    var _maximumLastEvents = config.getMaximumLastEvents();
    var _maximumEventsInMenu = config.getMaximumEventsInMenu();
    var _currentPage = context.getCurrentPage();
    var _currentRequest = context.getCurrentRequest();
    var _currentName = _currentRequest.params ?
      _currentRequest.params.name || null : null;
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

    function getFromCache(key, callback) {
      //callback(null);
      cache.get(key, function(err, val) {
        var value;

        if (err) {
          addError(new Error(err, 500));
          value = null;
        } else if (val.hasOwnProperty(key)) {
          value = val[key];
          //console.log('in cache...');
        } else {
          value = null;
          //console.log('not in cache...');
        }

        callback(value);
      });
    }

    function addToCache(key, value, callback) {
      //callback();
      cache.set(key, value, function(err, success) {
        if (err) {
          addError(new Error(err, 500));
        } else if (!success) {
          addError(new Error(
            'Un probleme est survenue lors de la mise en cache (clé: ' +
            key + ').', 500));
        }
        //console.log('put in cache: ' + key);
        callback();
      });
    }

    this.addToCache = addToCache;
    this.getFromCache = getFromCache;
    this.getCacheKeyPageSuffix = getCacheKeyPageSuffix;
    this.getWebsitesRepository = getWebsitesRepository;
    this.getImagesRepository = getImagesRepository;
    this.getProjectCategoriesRepository = getProjectCategoriesRepository;
    this.getProjectsRepository = getProjectsRepository;
    this.getPagesRepository = getPagesRepository;
    this.getEventsRepository = getEventsRepository;
    this.buildProjectCategoryUrl = buildProjectCategoryUrl;
    this.buildProjectUrl = buildProjectUrl;
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

    this.getWebsite = function(client) {
      var deferred = q.defer();
      var cacheKey = 'website';

      getFromCache(cacheKey, function(value) {
        if (value !== null) {
          deferred.resolve(value);
          return;
        }

        var repo = getWebsitesRepository();

        repo.getWebsiteByName(client, context.getCurrentWebsite(),
          function(x) {
            addToCache(cacheKey, x, function() {
              deferred.resolve(x);
            });
          },
          function() {
            addErrors(repo.getErrors());
            addError(new Error('Website not found', 404));
            deferred.reject();
          });
      });

      return deferred.promise;
    }

    this.getPage = function(client) {
      var deferred = q.defer();
      var cacheKey = 'page' + (_currentPage ? '_' + _currentPage : '') +
        getCacheKeyPageSuffix();

      getFromCache(cacheKey, function(value) {
        if (value !== null) {
          deferred.resolve(value);
          return;
        }

        var repo = getPagesRepository();

        repo.getPageByName(client, _currentPage, function(x) {
          addToCache(cacheKey, x, function() {
            deferred.resolve(x);
          });
        }, function() {
          addErrors(repo.getErrors());
          addError(new Error('Page "' + page + '" not found', 404));
          deferred.reject();
        });
      });

      return deferred.promise;
    }

    this.getPages = function(client) {
      var deferred = q.defer();
      var cacheKey = 'pages';

      getFromCache(cacheKey, function(value) {
        if (value !== null) {
          deferred.resolve(value);
          return;
        }

        var repo = getPagesRepository();

        repo.getAllPages(client, function(x) {
            addToCache(cacheKey, x, function() {
              deferred.resolve(x);
            });
          },
          function() {
            addErrors(repo.getErrors());
            //addError(new Error('Page menu not found', 404));
            deferred.reject();
          });
      });

      return deferred.promise;
    }

    this.getMenuEvents = function(client) {
      var deferred = q.defer();
      var cacheKey = 'menuEvents';

      getFromCache(cacheKey, function(value) {
        if (value !== null) {
          deferred.resolve(value);
          return;
        }

        var repo = getEventsRepository();
        var maximum = _maximumEventsInMenu > _maximumLastEvents ?
          _maximumEventsInMenu : _maximumLastEvents;

        repo.getMenuEvents(client, maximum, function(x) {
          addToCache(cacheKey, x, function() {
            deferred.resolve(x);
          });
        }, function() {
          addErrors(repo.getErrors());
          //addError(new Error('Event menu not found', 404));
          deferred.reject();
        });
      });

      return deferred.promise;
    }

    this.getMenuProjectCategories = function(client) {
      var deferred = q.defer();
      var cacheKey = 'menuProjectCategories';

      getFromCache(cacheKey, function(value) {
        if (value !== null) {
          deferred.resolve(value);
          return;
        }

        var repo = getProjectCategoriesRepository();

        repo.getMenuProjectCategories(client, function(x) {
          addToCache(cacheKey, x, function() {
            deferred.resolve(x);
          });
        }, function() {
          addErrors(repo.getErrors());
          //addError(new Error('Project category menu not found', 404));
          deferred.reject();
        });
      });

      return deferred.promise;
    }

    this.getFeaturedProjects = function(client) {
      var deferred = q.defer();

      if (viewHelpers.hasFeaturedProjects(_currentPage)) {
        var repo = getProjectsRepository();
        var exludedProjectName = _currentPage === _projectPage ?
          _currentName : null;

        repo.getFeaturedProjects(client, exludedProjectName, function(x) {
          deferred.resolve(x);
        }, function() {
          addErrors(repo.getErrors());
          //addError(new Error('Project category menu not found', 404));
          deferred.reject();
        });
      }

      return deferred.promise;
    }

    this.getImageBanners = function(client) {
      var deferred = q.defer();

      if (viewHelpers.hasBanners(_currentPage)) {
        var repo = getImagesRepository();

        repo.getBanners(client, function(x) {
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
        featuredProjects: getFeaturedProjectsData(x),
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
        },
        context: {
          currentPage: _currentPage,
          currentName: _currentName
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

    function getCacheKeyPageSuffix() {
      var suffix = _currentName ? '_' + _currentName : '';

      return suffix;
    }

    function getFeaturedProjectsData(x) {
      var featuredProjectsData = [];

      if (!x.featuredProjects) return featuredProjectsData;

      for (var i = 0; i < x.featuredProjects.length; i++) {
        var project = x.featuredProjects[i];

        var data = {
          title: project.title_short || project.title || '',
          description: project.description_short || '',
          url: buildProjectUrl(project.name)
        };

        featuredProjectsData.push(data);
      }

      return featuredProjectsData;
    }

    function getImageBannersData(x) {
      var imageBannersData = [];

      if (!x.imageBanners) return imageBannersData;

      for (var i = 0; i < x.imageBanners.length; i++) {
        var banner = x.imageBanners[i];
        var data = {
          imagePath: banner.path
        };

        if (banner.event_name) {

          data.title = banner.event_title_short ||
            banner.event_title || '';
          data.subtitle = formatDate(banner.event_date);
          data.description = banner.event_description_short || '';
          data.url = buildEventUrl(banner.event_name);

        } else if (banner.project_name) {

          data.title = banner.project_category_title_short ||
            banner.project_category_title || '';
          data.subtitle = banner.project_title_short ||
            banner.project_title || '';
          data.description = banner.project_description_short ||
            '';
          data.url = buildProjectUrl(banner.project_name);

        } else {

          data.title = data.subtitle = data.description =
            data.date = data.url = null;
        }

        imageBannersData.push(data);
      }

      return imageBannersData;
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

          } else if (data.lastEvents.length < _maximumLastEvents) {
            var lastEvent = {
              url: url,
              title: title,
              date: formatDate(event.date)
            };

            data.lastEvents.push(lastEvent);
          }

          if (data.menuPages.length < _maximumEventsInMenu) {
            var menuPage = {
              url: url,
              title: title,
              isCurrent: isCurrent
            };

            data.menuPages.push(menuPage);
          }
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

      return pageName === _currentName;
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

    function buildProjectUrl(projectName) {
      var url = '/' + _projectPage + '/' + projectName;

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
  require('dateformat'),
  require('../../modules/factories/repositoriesFactory'),
  require('../../modules/appConfig'),
  require('../../modules/appCache'),
  require('../../modules/viewHelpers'),
  require('../Error'));
