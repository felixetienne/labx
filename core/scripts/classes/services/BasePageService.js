(function() {

  module.exports = function(context, viewHelpers) {
    this.currentPage = context.getCurrentPage();
    this.currentRequest = context.getCurrentRequest();
    var _errors = [];

    this.getPageData = function(x) {
      var data = {
        website: {
          title: x.website.title,
          subtitle: x.website.subtitle,
          date: x.website.date,
          copyright: x.website.copyright,
          version: x.website.version
        },
        page: {
          title: x.page.title,
          shortTitle: x.page.title_short,
          description: x.page.description,
          name: x.page.name
        },
        allPages: []
      };

      for (k in x.allPages) {
        if (!x.allPages.hasOwnProperty(k)) continue;

        var page = x.allPages[k];

        data.allPages.push({
          shortTitle: page.title_short,
          shortDescription: page.description_short,
          name: page.name,
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

})();
