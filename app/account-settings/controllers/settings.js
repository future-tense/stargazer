/* global angular, console */

angular.module('app')
.controller('AccountSettingsCtrl', function ($ionicPopup, $scope, Wallet, Keychain) {
	'use strict';

	function hasPassword(accountId) {
		return (typeof Keychain.getKeyInfo(accountId) === 'object');
	}

	$scope.account = Wallet.current;
	$scope.hasPassword = hasPassword(Wallet.current.id);

	function removePassword(accountId) {
		$scope.data = {};
		var keyName = Wallet.accounts[accountId].alias;

		return $ionicPopup.show({
			template: '<input type="password" ng-model="data.password">',
			title: 'Remove Password for ' + keyName,
			scope: $scope,
			buttons: [
				{ text: 'Cancel' },
				{
					text: '<b>Remove</b>',
					type: 'button-positive',
					onTap: function(e) {
						if (!$scope.data.password) {
							e.preventDefault();
						} else {
							return $scope.data.password;
						}
					}
				}
			]
		});
	}

	function setPassword(accountId) {
		$scope.data = {};
		var keyName = Wallet.accounts[accountId].alias;

		return $ionicPopup.show({
			template: '<input type="password" ng-model="data.password">',
			title: 'Set Password for ' + keyName,
			scope: $scope,
			buttons: [
				{ text: 'Cancel' },
				{
					text: '<b>Set</b>',
					type: 'button-positive',
					onTap: function(e) {
						if (!$scope.data.password) {
							e.preventDefault();
						} else {
							return $scope.data.password;
						}
					}
				}
			]
		});
	}

	$scope.togglePassword = function () {

		var accountId = Wallet.current.id;
		if (hasPassword(accountId)) {
			console.log('removing password');
			removePassword(accountId)
			.then(function (password) {
				if (password) {
					console.log('remove');
					Keychain.removePassword(accountId, password);
					$scope.hasPassword = false;
				} else {
					console.log('cancel?');
					$scope.hasPassword = true;
				}
			});
		} else {
			console.log('setting password');
			setPassword(accountId)
			.then(function (password) {
				if (password) {
					Keychain.setPassword(accountId, password);
					$scope.hasPassword = true;
				} else {
					$scope.hasPassword = false;
				}
			});
		}
	};
});
