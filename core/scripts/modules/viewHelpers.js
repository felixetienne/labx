(function() {

  if (!global.staticViewHelpres) {

    global.staticViewHelpres = (function(mod, layoutHelpers) {
      var index = '';
      var error = 'error';
      var contact = 'joindre';
      var projects = 'portfolio';
      var project = 'projet';
      var services = 'services';
      var event = 'evenement';
      var events = 'evenements';
      var about = 'curriculum-vitae';


      mod.getLayout = function(pageName) {
        var layouts = layoutHelpers.getLayouts();

        switch (pageName) {
          // case index:
          // case contact:
          // case about:
          // case project:
          // case projects:
          // case services:
          // case event:
          // case events:
          case error:
            return layouts.fullContent;
          default:
            return layouts.rightAsides;
        }
      }

      mod.hasFeaturedProjects = function(pageName) {
        switch (pageName) {
          // case services:
          // case projects:
          // case project:
          // case event:
          // case events:
          // case index:
          // case contact:
          // case about:
          case error:
            return false;
          default:
            return true;
        }
      }

      mod.hasBanners = function(pageName) {
        switch (pageName) {
          //case error:
          //case project:
          //case projects:
          //case event:
          //case events:
          case index:
          case contact:
          case about:
          case services:
            return true;
          default:
            return false;
        }
      }

      mod.getView = function(pageName) {
        switch (pageName) {

          case index:
            return 'index';

          case contact:
            return 'contact';

          case about:
            return 'about';

          case event:
            return 'event';

          case events:
            return 'events';

          case services:
            return 'services';

          case project:
            return 'project';

          case projects:
            return 'projects';

          case 'projectCategory':
            return 'projectCategory';

          default:
            return 'error';
        }
      }

      mod.getIndexPage = function() {
        return index;
      };
      mod.getErrorPage = function() {
        return error;
      }
      mod.getContactPage = function() {
        return contact;
      };
      mod.getAboutPage = function() {
        return about;
      };
      mod.getProjectsPage = function() {
        return projects;
      };
      mod.getProjectPage = function() {
        return project;
      };
      mod.getServicesPage = function() {
        return services;
      };
      mod.getEventPage = function() {
        return event;
      };
      mod.getEventsPage = function() {
        return events;
      };

      mod.getStandardPages = function() {
        var names = [];

        names.push(index);
        names.push(contact);
        names.push(about);
        names.push(projects);
        names.push(services);
        names.push(events);

        return names;
      }

      return mod;

    })({}, require('./layoutHelpers'));
  }

  module.exports = global.staticViewHelpres;

})();
