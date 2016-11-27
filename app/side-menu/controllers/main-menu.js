/* global angular, console */

angular.module('app')
.controller('MainMenuCtrl', function ($scope, Wallet) {
	'use strict';

	$scope.wallet = Wallet;

	$scope.getType = function (account) {
		return account.isMultiSig()? 'ion-ios-people' : 'ion-ios-person';
	};

	$scope.getAccounts = function () {
		return Object.keys(Wallet.accounts)
		.map(function (id) {
			return Wallet.accounts[id];
		});
	};
});
