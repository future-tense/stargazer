/* global angular, console, toml */

angular.module('app')
.controller('HomeCtrl', function ($location, $route, $scope, $http, Anchors, History, Wallet) {
	'use strict';

	var accountId = $route.current.params.accountId;
	if (accountId) {
		Wallet.current = Wallet.accounts[accountId];
	}

	$scope.wallet = Wallet;

	$scope.doRefresh = function () {

		Wallet.current.refresh()
		.then(function () {
			$scope.$broadcast('scroll.refreshComplete');
		});
	};
});
