(function() {

  module.exports = function(viewHelpers) {
    var _projectPage = viewHelpers.getProjectPage();

    this.buildUrl = function(projectName) {
      var url = '/' + _projectPage + '/' + projectName;

      return url;
    }
  }

})();
