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

		concat: {
			vendor: {
				src: [
					'bower_components/angular-route/angular-route.min.js',
					'bower_components/angular-translate/angular-translate.min.js',
					'bower_components/messageformat/messageformat.js',
					'bower_components/angular-translate-interpolation-messageformat/angular-translate-interpolation-messageformat.min.js',
					'bower_components/buffer/buffer.min.js',
					'bower_components/decimal.js/decimal.js',
					'build/bower_components/jsqrcode/lib/qrcode-decoder.min.js',
					'bower_components/moment/min/moment-with-locales.js',
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
					'!app/app.js'
				],
				dest: 'dist/js/stargazer.js'
			}
		},

		// Copies remaining files to places other tasks can use
		copy: {
			'font-awesome': {
				files: [{
					src: 'bower_components/font-awesome/css/font-awesome.min.css',
					dest: 'dist/css/font-awesome.min.css'
				},{
					expand: true,
					cwd: 'bower_components/font-awesome/fonts/',
					src: ['fontawesome-webfont.*'],
					dest: 'dist/fonts/'
				}]
			},
			ionic: {
				files: [{
					src: 'bower_components/ionic/release/js/ionic.bundle.js',
					dest: 'dist/js/ionic.bundle.js'
				}, {
					expand: true,
					cwd: 'bower_components/ionic/release/fonts/',
					src: ['*'],
					dest: 'dist/fonts/'
				}, {
					src: 'bower_components/ionic/release/css/ionic.min.css',
					dest: 'dist/css/ionic.min.css'
				}]
			},
			lodash: {
				files: [{
					src: 'bower_components/lodash/dist/lodash.min.js',
					dest: 'dist/js/lodash.min.js'
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

		watch: {
			options: {
				spawn: false
			},
			files: [
				'app/**/*',
				'content/**/*'
			],
			tasks: [
				'build'
			]
		},

		nwjs: {
			options: {
				version: 'latest',
				flavor: 'normal',
				platforms: ['osx64', 'win64', 'linux64'],
				buildDir: './webkitbuilds'		// Where the build version of my NW.js app is saved
			},
			src: ['./nwjs/**'] // Your NW.js app
		},

		sloc: {
			'style3': {
				files: [
					{ src: ['app/**/*.js'] }
				]
			}
		}
	});

	grunt.registerTask('build', [
		'replace:jsqrcode',
		'preprocess:app',
		'concat',
		'copy'
	]);

	grunt.registerTask('default', [
		'build',
		'watch'
	]);
};
