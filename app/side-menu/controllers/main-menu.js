/* global angular, console */

angular.module('app')
.controller('MainMenuCtrl', function ($scope, Transactions, Wallet) {
	'use strict';

	$scope.getType		 = getType;
	$scope.getBadgeCount = getBadgeCount;

	$scope.wallet		= Wallet;
	$scope.accounts		= Wallet.accountList;
	$scope.transactions	= Transactions.list;

	function getBadgeCount(account) {
		if (account !== Wallet.current) {
			return account.getBadgeCount();
		} else {
			return 0;
		}
	}

	function getType(account) {
		return account.isMultiSig()? 'icon-people' : 'icon-person';
	}
});
