/* global angular, console, toml */

angular.module('app')
.controller('OverviewCtrl', function ($route, $scope, Horizon, Transactions, Wallet) {
	'use strict';

	var accountId = $route.current.params.accountId;
	if (accountId) {
		Wallet.current = Wallet.accounts[accountId];
	}

	$scope.wallet = Wallet;
	$scope.pending = Transactions;

	$scope.pubkey = Wallet.current.id;

	$scope.isActivated = function () {
		return Wallet.current.getNativeBalance() !== '0';
	};

	$scope.getAssets = function () {

		return Wallet.current.balances.filter(function (e) {
			if (e.asset_type === 'native') {
				return true;
			} else {
				return (e.balance !== '0.0000000');
			}
		});
	};

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
