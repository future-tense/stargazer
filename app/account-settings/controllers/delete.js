/* global angular, console */

angular.module('app')
.controller('DeleteAccountCtrl', function ($location, $scope, Keychain, Wallet) {
	'use strict';

	$scope.form = {};
	$scope.account = Wallet.current;
	$scope.isEncrypted = Keychain.isEncrypted(Wallet.current.id);

	$scope.delete = function () {
		Wallet.removeAccount(Wallet.current);
		$location.path('/');
	};
});
