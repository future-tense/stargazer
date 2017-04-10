/* global angular, console */

angular.module('app')
.controller('MainMenuCtrl', function ($scope, Transactions, Wallet) {
	'use strict';

	$scope.getType = getType;

	$scope.wallet		= Wallet;
	$scope.accounts		= Wallet.accountList;
	$scope.transactions	= Transactions.list;

	function getType(account) {
		return account.isMultiSig()? 'icon-people' : 'icon-person';
	}
});
