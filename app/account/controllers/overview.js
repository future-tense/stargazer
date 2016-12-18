/* global angular, console, toml */

angular.module('app')
.controller('OverviewCtrl', function ($route, $scope, Wallet) {
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
		}, function (err) {
			$scope.$broadcast('scroll.refreshComplete');
			// :TODO: Display some message about not being able to refresh
		});
	};
});
