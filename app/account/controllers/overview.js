/* global angular, console, toml */

angular.module('app')
.controller('OverviewCtrl', function ($route, $scope, Wallet) {
	'use strict';

	$scope.isActivated	= isActivated;
	$scope.getAssets	= getAssets;
	$scope.doRefresh	= doRefresh;
	$scope.wallet		= Wallet;

	activate();

	function activate() {
		const accountId = $route.current.params.accountId;
		if (accountId) {
			Wallet.current = Wallet.accounts[accountId];
			Wallet.current.clearBadgeCount();
		}
	}

	function doRefresh() {

		Wallet.current.refresh()
		.then(() => {
			$scope.$broadcast('scroll.refreshComplete');
		})
		.catch(err => {
			$scope.$broadcast('scroll.refreshComplete');
			// :TODO: Display some message about not being able to refresh
		});
	}

	function getAssets() {

		return Wallet.current.balances.filter(item => {
			if (item.asset_type === 'native') {
				return true;
			} else {
				return (item.balance !== '0.0000000');
			}
		});
	}

	function isActivated() {
		return Wallet.current.getNativeBalance() !== '0';
	}
});
