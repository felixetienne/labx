(function() {

  module.exports = (function(mod, layoutHelpers) {
    var index = '';
    var error = 'error';
    var contact = 'joindre';
    var about = 'a-propos';
    var projects = 'projets';
    var project = 'projet';
    var services = 'services';
    var event = 'in-progress';
    var events = 'in-progress-events';
    var curriculumVitae = 'curriculum-vitae';

    mod.getView = function(pageName) {
      switch (pageName) {

        case
        index:
          return 'index';

        case
        contact:
          return 'contact';

        case
        about:
          return 'about';

        case
        event:
          return 'event';

        case
        events:
          return 'events';

        case
        services:
          return 'services';

        case
        curriculumVitae:
          return 'curriculumVitae';

        case
        project:
          return 'project';

        case
        projects:
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
    mod.getCurriculumVitaePage = function() {
      return curriculumVitae;
    };

    mod.getStaticPages = function() {
      var names = [];

      names.push(index);
      names.push(contact);
      names.push(about);
      names.push(curriculumVitae);
      names.push(projects);
      names.push(services);
      names.push(events);

      return names;
    }

    mod.getLayout = function(pageName) {
      var layouts = layoutHelpers.getLayouts();
      var layout;

      switch (pageName) {
        //case error:
        //case index:
        case contact:
        case about:
        case project:
        case projects:
        case services:
        case event:
        case events:
        case curriculumVitae:
          {
            layout = layouts.rightAsides;
            break;
          }
        default:
          {
            layout = layouts.fullContent;
            break;
          }
      }

      return layout;
    }

    return mod;

  })({}, require('./layoutHelpers'));

})();
