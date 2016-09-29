/* global angular */

angular.module('app')
.config(function ($routeProvider) {
	'use strict';

	$routeProvider
	.when('/account-settings', {
		templateUrl: 'app/account-settings/views/settings.html',
		controller: 'AccountSettingsCtrl'
	})
	.when('/account-settings/alias', {
		templateUrl: 'app/account-settings/views/alias.html',
		controller: 'AccountAliasCtrl'
	})
	.when('/account-settings/delete', {
		templateUrl: 'app/account-settings/views/delete.html',
		controller: 'DeleteAccountCtrl'
	})
	.when('/account-settings/export', {
		templateUrl: 'app/account-settings/views/export.html',
		controller: 'ExportAccountCtrl'
	})
	.when('/account-settings/federation', {
		templateUrl: 'app/account-settings/views/federation.html',
		controller: 'AccountFederationCtrl'
	})
	.when('/account-settings/signers', {
		templateUrl: 'app/account-settings/views/signers.html',
		controller: 'AccountSignersCtrl'
	})
	.when('/account-settings/trustlines', {
		templateUrl: 'app/account-settings/views/trustlines.html',
		controller: 'AccountTrustlinesCtrl'
	});
});
