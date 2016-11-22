/* global angular, console */

angular.module('app')
.controller('AccountSettingsCtrl', function ($q, $scope, $timeout, $translate, Keychain, Modal, Wallet) {
	'use strict';

	var hasPassword	= Keychain.isEncrypted;
	var accountId	= Wallet.current.id;

	$scope.account = Wallet.current;
	$scope.flag = {
		hasPassword: hasPassword(accountId)
	};

	$scope.togglePassword = function () {

		if (hasPassword(accountId)) {
			Modal.show('app/account-settings/modals/remove-password.html', $scope)
			.then(
				function (password) {
					Keychain.removePassword(accountId, password);
				},
				function () {
					$scope.flag.hasPassword = true;
				}
			);
		}

		else {
			Modal.show('app/account-settings/modals/add-password.html', $scope)
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
