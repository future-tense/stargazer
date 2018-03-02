/* global module, require */

module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-contrib-copy');

	// Define the configuration for all the tasks
	grunt.initConfig({

		// Copies remaining files to places other tasks can use
		copy: {
			ionic: {
				files: [{
					src: 'node_modules/ionic-sdk/release/css/ionic.min.css',
					dest: 'dist/css/ionic.min.css'
				}]
			},
			content: {
				expand: true,
				cwd: 'content',
				src: ['**/*'],
				dest: 'dist/'
			}
		}
	});
};
