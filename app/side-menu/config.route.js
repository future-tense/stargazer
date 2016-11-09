/* global angular */

angular.module('app')
.config(function ($routeProvider) {
	'use strict';

	$routeProvider
	.when('/side-menu/add-account', {
		templateUrl: 'app/side-menu/views/add-account.html'
	})
	.when('/side-menu/import-account/:data?', {
		templateUrl: 'app/side-menu/views/import-account.html',
		controller: 'ImportAccountCtrl'
	})
	.when('/side-menu/create-account', {
		templateUrl: 'app/side-menu/views/create-account.html',
		controller: 'CreateAccountCtrl'
	})
	.when('/side-menu/contacts', {
		templateUrl: 'app/side-menu/views/contact-list.html',
		controller: 'ContactListCtrl'
	})
	.when('/side-menu/contact/:name', {
		templateUrl: 'app/side-menu/views/edit-contact.html',
		controller: 'EditContactCtrl'
	});
});
