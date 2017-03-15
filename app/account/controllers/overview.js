/* global angular, console, toml */

angular.module('app')
.controller('OverviewCtrl', function ($route, $scope, Horizon, Wallet) {
	'use strict';

	var accountId = $route.current.params.accountId;
	if (accountId) {
		Wallet.current = Wallet.accounts[accountId];
	}

	$scope.wallet = Wallet;

	var network = Wallet.current.network;
	if (network !== Horizon.public) {
		$scope.network = Horizon.getNetwork(network).name;
	}

	$scope.lockClass = Wallet.current.isLocallySecure()? 'ion-ios-locked-outline' : 'ion-ios-unlocked-outline';

	$scope.isActivated = function () {
		return Wallet.current.getNativeBalance() !== '0';
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
