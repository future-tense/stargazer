/* global module, require */

module.exports = function (grunt) {
	'use strict';

	// Time how long tasks take. Can help when optimizing build times
/*	require('time-grunt')(grunt);
*/
	// Automatically load required Grunt tasks
	require('jit-grunt')(grunt, {
		nwjs: 'grunt-nw-builder',
		sloc: 'grunt-file-sloc'
	});

	// Define the configuration for all the tasks
	grunt.initConfig({

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

		browserify: {
			dist: {
				files: {
					'build/jazzicon.js': ['app/core/services/jazzicon.js']
				}
			}
		},

		concat: {
			vendor: {
				src: [
					'bower_components/angular-route/angular-route.min.js',
					'bower_components/messageformat/messageformat.js',
					'bower_components/buffer/buffer.min.js',
					'bower_components/crypto-js/crypto-js.js',
					'bower_components/decimal.js/decimal.js',
					'build/bower_components/jsqrcode/lib/qrcode-decoder.min.js',
					'bower_components/qrcode.js/qrcode.js',
					'bower_components/sjcl/sjcl.js',
					'bower_components/stellar-sdk/stellar-sdk.min.js',
					'bower_components/toml-j0.4/dist/toml-browser.js'
				],
				dest: 'dist/js/vendor.js'
			},
			js: {
				src: [
					'build/app.js',
					'app/**/*.js',
					'build/jazzicon.js',
					'!app/app.js',
					'!app/core/services/jazzicon.js'
				],
				dest: 'dist/js/stargazer.js'
			}
		},

		// Copies remaining files to places other tasks can use
		copy: {
			ionic: {
				files: [{
					src: 'bower_components/ionic/release/js/ionic.bundle.js',
					dest: 'dist/js/ionic.bundle.js'
				}, {
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
		'browserify:dist',
		'concat',
		'copy'
	]);

	grunt.registerTask('default', [
		'build',
		'watch'
	]);
};
