/* global angular, console */

angular.module('app')
.controller('MainMenuCtrl', function ($scope, Wallet) {
	'use strict';

	$scope.wallet = Wallet;
	$scope.accounts = Wallet.accountList;


	$scope.getType = function (account) {
		return account.isMultiSig()? 'ion-ios-people' : 'ion-ios-person';
	};
});
