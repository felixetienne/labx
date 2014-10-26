module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
				files: ['**/*.scss'],
				tasks: ['sass:dist']
		},
		sass: {
			options: {
				sourceMap: false,
				outputStyle: 'compressed'
			},
			dist: {
				files: {
					'public/styles/main.css': 'assets/styles/main.scss'
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['sass:dist', 'watch']);
}
