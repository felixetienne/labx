(function(config) {

  module.exports = function() {
    var _currentWebsiteName = null;
    var _currentRequest = null;
    var _currentPage = null;
    var _currentView = null;
    var _errorView = null;

    this.getCurrentWebsiteName = function() {
      return _currentWebsiteName;
    }
    this.setCurrentWebsiteName = function(value) {
      _currentWebsiteName = value;
      return this;
    }
    this.getCurrentRequest = function() {
      return _currentRequest;
    }
    this.setCurrentRequest = function(value) {
      _currentRequest = value;
      return this;
    }

    this.getCurrentPage = function() {
      return _currentPage;
    }
    this.setCurrentPage = function(value) {
      _currentPage = value;
      return this;
    }

    this.getCurrentView = function() {
      return _currentView;
    }
    this.setCurrentView = function(value) {
      _currentView = value;
      return this;
    }

    this.getErrorView = function() {
      return _errorView;
    }
    this.setErrorView = function(value) {
      _errorView = value;
      return this;
    }
  }

})(require('../modules/appConfig'));
