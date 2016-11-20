/* global angular, console */

angular.module('app')
.controller('AccountSettingsCtrl', function ($ionicPopup, $q, $scope, $timeout, $translate, Wallet, Keychain) {
	'use strict';

	var hasPassword = Keychain.isEncrypted;

	$scope.account = Wallet.current;
	$scope.flag = {
		hasPassword: hasPassword(Wallet.current.id)
	};

	function removePassword(accountId) {
		$scope.data = {};
		var keyName = Wallet.accounts[accountId].alias;

		return $q.all([
			$translate('popup.remove-password.heading', {name: keyName}),
			$translate('global.cancel'),
			$translate('global.ok')
		])
		.then(function (res) {
			return $q(function (resolve, reject) {
				$ionicPopup.show({
					template: '<input type="password" ng-model="data.password">',
					title: res[0],
					scope: $scope,
					buttons: [
						{
							text: res[1],
							onTap: reject
						},
						{
							text: '<b>' + res[2] + '</b>',
							type: 'button-positive',
							onTap: function (e) {
								if ($scope.data.password) {
									resolve($scope.data.password);
								} else {
									e.preventDefault();
								}
							}
						}
					]
				});
			});
		});
	}

	function setPassword(accountId) {
		$scope.data = {};
		var keyName = Wallet.accounts[accountId].alias;

		return $q.all([
			$translate('popup.set-password.heading', {name: keyName}),
			$translate('global.cancel'),
			$translate('global.ok')
		])
		.then(function (res) {
			return $q(function (resolve, reject) {
				$ionicPopup.show({
					template: '<input type="password" ng-model="data.password">',
					title: res[0],
					scope: $scope,
					buttons: [
						{
							text: res[1],
							onTap: reject
						},
						{
							text: '<b>' + res[2] + '</b>',
							type: 'button-positive',
							onTap: function (e) {
								if ($scope.data.password) {
									resolve($scope.data.password);
								} else {
									e.preventDefault();
								}
							}
						}
					]
				});
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
