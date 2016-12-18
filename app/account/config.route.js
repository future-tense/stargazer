/* global angular */

angular.module('app')
.config(function ($routeProvider) {
	'use strict';

	$routeProvider
	.when('/', {
		templateUrl: 'app/account/views/overview.html',
		controller: 'OverviewCtrl'
	})

	.when('/account/overview', {
		templateUrl: 'app/account/views/overview.html',
		controller: 'OverviewCtrl'
	})

	.when('/account/send/', {
		templateUrl: 'app/account/views/send.html',
		controller: 'SendCtrl'
	})

	.when('/account/recv', {
		templateUrl: 'app/account/views/receive.html',
		controller: 'ReceiveCtrl'
	})

	.when('/account/:accountId', {
		templateUrl: 'app/account/views/overview.html',
		controller: 'OverviewCtrl'
	})

	.when('/account/transaction/:id', {
		templateUrl: 'app/account/views/transaction.html',
		controller: 'TransactionCtrl'
	});
});
