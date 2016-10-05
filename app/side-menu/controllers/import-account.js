/* global angular, console, StellarSdk */

angular.module('app')
.controller('ImportAccountCtrl', function ($location, $routeParams, $scope, Keychain, Wallet) {
	'use strict';

	var data;
	if ($routeParams.data) {
		data = JSON.parse(window.atob($routeParams.data));
		$scope.encrypted = (typeof data.key === 'object');
		$scope.scanned = true;
	}

	//	:TODO: get these from Horizon
	$scope.networks = [{
		title:	'Livenet',
		phrase: 'Public Global Stellar Network ; September 2015'
	}, {
		title:	'Testnet',
		phrase: 'Test SDF Network ; September 2015'
	}];

	var numAccounts = Object.keys(Wallet.accounts).length;
	$scope.account = {
		alias:		'Personal Account #' + (numAccounts + 1),
		network:	$scope.networks[0]
	};

	$scope.import = function () {

		var accountId;
		var seed;
		var name = $scope.account.alias;
		var network;
		var keyStore;

		if ($scope.scanned) {

			if ($scope.encrypted) {
				seed = Keychain.decrypt(data.key, $scope.account.password);
			} else {
				seed = data.key;
			}
			network = data.account.network;
			keyStore = data.key;
		} else {
			seed = $scope.account.seed;
			network = $scope.account.network.phrase;
			keyStore = seed;
		}

		accountId = StellarSdk.Keypair.fromSeed(seed).accountId();
		Wallet.importAccount(accountId, keyStore, name, network);
		$location.path('/');
	};
});
