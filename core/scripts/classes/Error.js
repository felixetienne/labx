(function() {

  module.exports = function(message, code) {
    var _message = message;
    var _code = code || 0;
    this.getMessage = function() {
      return _message;
    }
    this.getCode = function() {
      return _code;
    }
    this.print = function() {
      console.error('[' + _code + '] ' + _message);
    }
  }

})();
