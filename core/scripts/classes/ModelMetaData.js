(function() {

  module.exports = function(errors) {
    var _errors = !errors ? [] : (Array.isArray(errors) ? errors : [errors]);

    this.hasError = function() {
      return _errors.length > 0;
    }

    this.getErrors = function() {
      return _errors;
    };
  }

})();
