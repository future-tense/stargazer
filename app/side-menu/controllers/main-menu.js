/* global angular, console */

angular.module('app')
.controller('MainMenuCtrl', function ($scope, $timeout, Wallet) {
	'use strict';

	var timeout;
	function cancelTimeout() {
		if (timeout) {
			$timeout.cancel(timeout);
		}
	}

	function triggerTimeout() {
		cancelTimeout();

		timeout = $timeout(2000)
		.then(function () {
			$scope.showReorder = false;
		});
	}

	$scope.wallet = Wallet;
	$scope.accounts = Wallet.accountList;

	$scope.showReorder = false;
	$scope.reorder = function () {
		$scope.showReorder = true;
	};

	$scope.release = triggerTimeout;
	$scope.touch = cancelTimeout;
		$scope.moveItem = Wallet.moveAccount;

	$scope.getType = function (account) {
		return account.isMultiSig()? 'ion-ios-people' : 'ion-ios-person';
	};
});
