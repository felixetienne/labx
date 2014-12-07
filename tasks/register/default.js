module.exports = function(grunt) {
    'use strict';

    grunt.registerTask('default', [
        'sass:dist',
        //'express:dev',
        'watch:sass',
        'watch:jshint'
    ]);
};
