/* global angular */

angular.module('app')
.config(function ($routeProvider) {
	'use strict';

	$routeProvider
	.when('/transaction/:txHash', {
		templateUrl: 'app/transaction/views/index.html',
		controller: 'PendingTransactionCtrl'
	});
});
