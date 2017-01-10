/* global angular, console, StellarSdk */

angular.module('app')
.controller('ImportAccountCtrl', function ($location, $routeParams, $scope, $translate, Keychain, Wallet) {
	'use strict';

	$scope.advanced = false;
	$scope.account = {};

	if ($routeParams.data) {
		var data = JSON.parse(window.atob($routeParams.data));
		$scope.encrypted = (typeof data.key === 'object');
		$scope.scanned = true;
		$scope.account.seed = data.key;
		$scope.account.network = data.account.network;
	}

	var numAccounts = Object.keys(Wallet.accounts).length;
	$scope.account.alias = $translate.instant('account.defaultname', {number: numAccounts + 1});

	$scope.import = function () {
		var keyStore  = $scope.account.seed;
		var accountId = Keychain.idFromKey(keyStore, $scope.account.password);
		Wallet.importAccount(accountId, keyStore, $scope.account.alias, $scope.account.network);
		$location.path('/');
	};
});
