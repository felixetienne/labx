// Watches files for changes and runs tasks based on the changed files
module.exports = function(grunt) {
  'use strict';

    grunt.config.set('watch', {
        sass: {
            files: [
                '**/*.scss'
            ],
            tasks: ['sass:dist']
        },
        express: {
            files: [
                'core/**/.js',
            ],
            tasks: [
                'express:dev'
            ]
        },
        jshint: {
            files: [
                'core/**/.js',
                //'public/**/*.js',
                //'!public/scripts/frameworks/',
                //'!public/scripts/librairies/',
                'public/scripts/main.js',
                'Gruntfile.js',
                'tasks/**/*.js'
            ],
            tasks: ['jshint']
        }
    });
};
