(function() {

  module.exports = (function(mod) {
    var index = '';
    var error = 'error';
    var contact = 'joindre';
    var about = 'a-propos';
    var projects = 'projets';
    var project = 'projet';
    var services = 'services';
    var events = 'in-progress';
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

    return mod;

  })({});

})();
