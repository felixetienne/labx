(function() {

  module.exports = function(errors) {
    var _errors = errors ? (Array.isArray(errors) ? errors : [errors]) : [];
    var _isErrorPage = false;

    this.hasErrors = function() {
      return _errors.length > 0;
    }

    this.getErrors = function() {
      return _errors;
    };

    this.asErrorPage = function() {
      _isErrorPage = true;
      return this;
    }

    this.isErrorPage = _isErrorPage;
  }

})();
