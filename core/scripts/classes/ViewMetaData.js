(function(layoutHelpers) {

  module.exports = function(errors) {
    var _layouts = layoutHelpers.getLayouts();
    var _layout = _layouts.fullContent;
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

    this.isErrorPage = function() {
      return _isErrorPage;
    }

    this.setLayout = function(layout) {
      if (layoutHelpers.isValid(layout)) {
        _layout = layout;
      }
      return this;
    }

    this.isFullContentLayout = function() {
      return _layout === _layouts.fullContent;
    }

    this.isRightAsidesLayout = function() {
      return _layout === _layouts.rightAsides;
    }
  }

})(require('../modules/layoutHelpers'));
