// Validate JavaScript files with JSHint.
module.exports = function(grunt) {
  'use strict';

  grunt.config.set('jshint', {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
    },
    all: [
        'core/**/.js',
        //'public/**/*.js',
        //'!public/scripts/frameworks/',
        //'!public/scripts/librairies/',
        'public/scripts/main.js',
        'Gruntfile.js',
        'tasks/**/*.js'
    ]
  });
};
