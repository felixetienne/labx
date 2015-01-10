(function() {

  if (!global.staticRessourceHelpers) {

    global.staticRessourceHelpers = (function(mod, viewHelpers) {
      var _ressourcesFunctions = {};

      function getBaseRessources() {
        return {
          banners: {
            readMore: 'Voir'
          },
          lastEvents: {
            title: 'Événements',
            readMore: 'lire...'
          },
          featuredProjects: {
            title: 'Contemporain',
            readMore: 'voir...'
          },
          header: {
            navigationToggleButton: 'Changer le format de la navigation'
          },
          footer: {
            navigationTitle: 'Navigation secondaire'
          }
        };
      }

      _ressourcesFunctions[viewHelpers.getEventsPage()] = function() {
        return {
          readMore: "Lire l'article.",
        };
      }

      _ressourcesFunctions[viewHelpers.getProjectsPage()] = function() {
        return {
          readMore: 'Voir le projet.',
          seeAllProjectsFormat: 'Voir tout les projects de la catégorie {0}.'
        };
      }

      mod.getMenuRessources = function() {
        return {
          seeAllEvents: 'Consulter tout',
          seeAllProjects: 'Voir tout'
        }
      }

      mod.getRessources = function(context) {
        var page = context.getCurrentPage();
        var data = getBaseRessources();

        if (_ressourcesFunctions.hasOwnProperty(page)) {
          data.current = _ressourcesFunctions[page]();
        }

        return data;
      }

      return mod;

    })({},
      require('./viewHelpers'));
  }

  module.exports = global.staticRessourceHelpers;

})();
