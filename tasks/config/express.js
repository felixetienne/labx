// Start an Express.js web server using grunt.js
'use strict';

(function(appConfig) {

  module.exports = function(grunt) {

    grunt.config.set('express', {
      dev: {
        options: {
          script: 'app.js',
          port: appConfig.getCurrentPort()
        }
      }
    });
  }

})(require('../../core/scripts/modules/appConfig'));
