/* global module, require */

module.exports = function (grunt) {
	'use strict';

	// Time how long tasks take. Can help when optimizing build times
/*	require('time-grunt')(grunt);
*/
	// Automatically load required Grunt tasks
	require('jit-grunt')(grunt, {
		sloc: 'grunt-file-sloc'
	});

	// Define the configuration for all the tasks
	grunt.initConfig({

		clean: [
			'build',
			'dist'
		],

		replace: {
			jsqrcode: {
				files: [{
					src: ['bower_components/jsqrcode/lib/qrcode-decoder.min.js'],
					dest: 'build/'
				}],
				options: {
					usePrefix: false,
					patterns: [{
						match: 'qrcode=qrcode||{}',
						replacement: 'qrcode={}'
					}]
				}
			}
		},

		// Copies remaining files to places other tasks can use
		copy: {
			ionic: {
				files: [{
					src: 'bower_components/ionic/release/css/ionic.min.css',
					dest: 'dist/css/ionic.min.css'
				}]
			},
			content: {
				expand: true,
				cwd: 'content',
				src: ['**/*'],
				dest: 'dist/'
			},
			html: {
				expand: true,
				cwd: '',
				src: ['app/**/*.html'],
				dest: 'dist/'
			}
		},

		preprocess: {
			app: {
				src : 'app/app.js',
				dest : 'build/app.js'
			}
		},

		chokidar: {
			options: {
				spawn: false
			},
			files: [
				'i18n/**/*',
				'app/**/*',
				'content/**/*',
				'gruntfile.js'
			],
			tasks: [
				'build'
			]
		},

		sloc: {
			'style3': {
				files: [
					{ src: ['app/**/*.js'] }
				]
			}
		}
	});

	grunt.registerTask('watch', ['chokidar']);

	grunt.registerTask('build', [
		'replace:jsqrcode',
		'preprocess:app',
		'copy'
	]);

	grunt.registerTask('default', [
		'build',
		'watch'
	]);
};
