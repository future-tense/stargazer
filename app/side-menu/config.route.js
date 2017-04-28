/* global angular */

angular.module('app')
.config(function ($routeProvider) {
	'use strict';

	$routeProvider
	.when('/side-menu/about', {
		template: '<about-app></about-app>'
	})
	.when('/side-menu/add-account', {
		template: '<add-account></add-account>'
	})
	.when('/side-menu/import-account/:data?', {
		template: '<import-account></import-account>'
	})
	.when('/side-menu/create-personal', {
		template: '<create-personal></create-personal>'
	})
	.when('/side-menu/create-shared', {
		template: '<create-shared></create-shared>'
	})
	.when('/side-menu/contacts', {
		template: '<contact-list></contact-list>'
	})
	.when('/side-menu/contact/:name', {
		template: '<edit-contact></edit-contact>'
	})
	.when('/side-menu/language', {
		template: '<language></language>'
	})
	.when('/side-menu/settings', {
		template: '<global-settings></global-settings>'
	});
});
