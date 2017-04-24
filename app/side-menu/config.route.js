/* global angular */

angular.module('app')
.config(function ($routeProvider) {
	'use strict';

	$routeProvider
	.when('/side-menu/about', {
		templateUrl: 'app/side-menu/views/about.html',
		controller: 'AboutCtrl'
	})
	.when('/side-menu/add-account', {
		templateUrl: 'app/side-menu/views/add-account.html'
	})
	.when('/side-menu/import-account/:data?', {
		templateUrl: 'app/side-menu/views/import-account.html',
		controller: 'ImportAccountCtrl'
	})
	.when('/side-menu/create-personal', {
		templateUrl: 'app/side-menu/views/create-personal.html',
		controller: 'CreatePersonalAccountCtrl'
	})
	.when('/side-menu/create-shared', {
		templateUrl: 'app/side-menu/views/create-shared.html',
		controller: 'CreateSharedAccountCtrl'
	})
	.when('/side-menu/contacts', {
		templateUrl: 'app/side-menu/views/contact-list.html',
		controller: 'ContactListCtrl'
	})
	.when('/side-menu/contact/:name', {
		templateUrl: 'app/side-menu/views/edit-contact.html',
		controller: 'EditContactCtrl'
	})
	.when('/side-menu/language', {
		templateUrl: 'app/side-menu/views/language.html',
		controller: 'LanguageCtrl'
	})
	.when('/side-menu/settings', {
		templateUrl: 'app/side-menu/views/settings.html',
		controller: 'GlobalSettingsCtrl'
	});
});
