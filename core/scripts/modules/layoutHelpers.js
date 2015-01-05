(function() {

  if (!global.staticLayoutHelpers) {

    global.staticLayoutHelpers = (function(mod) {
      var _layouts = {
        fullContent: 'fullContent',
        rightAsides: 'rightAsides'
      };

      mod.getLayouts = function() {
        return _layouts;
      }

      mod.getDefault = function() {
        return _layouts.fullContent;
      }

      mod.isValid = function(layout) {
        for (k in _layouts) {
          if (_layouts.hasOwnProperty(k) || _layouts[k] === layout)
            return true;
        }

        return false;
      }

      return mod;

    })({});
  }

  module.exports = global.staticLayoutHelpers;

})();
