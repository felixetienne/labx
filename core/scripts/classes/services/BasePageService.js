(function() {

  module.exports = function(context, viewHelpers, dateFormat) {
    var _currentPage = context.getCurrentPage();
    var _currentRequest = context.getCurrentRequest();
    var _errors = [];

    this.getCurrentPage = function() {
      return _currentPage;
    }

    this.getCurrentRequest = function() {
      return _currentRequest;
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
        menuPages: []
      };

      for (k in x.menuPages) {
        if (!x.menuPages.hasOwnProperty(k)) continue;

        var page = x.menuPages[k];

        data.menuPages.push({
          title: page.title_short,
          description: page.description_short,
          isCurrent: page.name === _currentPage,
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
