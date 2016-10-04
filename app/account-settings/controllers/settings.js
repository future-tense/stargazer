/* global angular, console */

angular.module('app')
.controller('AccountSettingsCtrl', function ($ionicPopup, $q, $scope, $timeout, Wallet, Keychain) {
	'use strict';

	var hasPassword = Keychain.isEncrypted;

	$scope.account = Wallet.current;
	$scope.flag = {
		hasPassword:	hasPassword(Wallet.current.id)
	};

	function removePassword(accountId) {
		$scope.data = {};
		var keyName = Wallet.accounts[accountId].alias;

		return $q(function(resolve, reject) {
			$ionicPopup.show({
				template: '<input type="password" ng-model="data.password">',
				title: 'Remove Password for ' + keyName,
				scope: $scope,
				buttons: [
					{
						text: 'Cancel',
						onTap: reject
					},
					{
						text: '<b>Remove</b>',
						type: 'button-positive',
						onTap: function (e) {
							if (!$scope.data.password) {
								e.preventDefault();
							} else {
								resolve($scope.data.password);
							}
						}
					}
				]
			});
		});
	}

	function setPassword(accountId) {
		$scope.data = {};
		var keyName = Wallet.accounts[accountId].alias;

		return $q(function(resolve, reject) {
			$ionicPopup.show({
				template: '<input type="password" ng-model="data.password">',
				title: 'Set Password for ' + keyName,
				scope: $scope,
				buttons: [
					{
						text: 'Cancel',
						onTap: reject
					},
					{
						text: '<b>Set</b>',
						type: 'button-positive',
						onTap: function (e) {
							if (!$scope.data.password) {
								e.preventDefault();
							} else {
								resolve($scope.data.password);
							}
						}
					}
				]
			});
		});
	}

	$scope.togglePassword = function () {

		var accountId = Wallet.current.id;
		if (hasPassword(accountId)) {
			removePassword(accountId)
			.then(
				function (password) {
					Keychain.removePassword(accountId, password);
				},
				function () {
					$scope.flag.hasPassword = true;
				}
			);
		} else {
			setPassword(accountId)
			.then(
				function (password) {
					Keychain.setPassword(accountId, password);
				},
				function () {
					$scope.flag.hasPassword = false;
				}
			);
		}
	};
});
