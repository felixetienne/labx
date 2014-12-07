module.exports = function(grunt) {
  'use strict';

    grunt.config.set('sass', {
        options: {
				sourceMap: false,
				//outputStyle: 'expanded'
				outputStyle: 'compact'
				//outputStyle: 'compressed'
        },
        dist: {
            files: {
                'public/styles/main.css': 'core/styles/main.scss'
            }
        }
    });
};
