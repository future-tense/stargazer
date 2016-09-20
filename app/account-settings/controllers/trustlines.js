/* global angular, console */

angular.module('app')
.controller('AccountTrustlinesCtrl', function ($rootScope, $scope, Wallet) {
	'use strict';

	$scope.account = Wallet.current;

	$scope.getTrustlines = function () {
		return $scope.account.balances.filter(function (balance) {
			return balance.asset_type !== 'native';
		});
	};

	$scope.save = function () {
		$scope.account.alias = $scope.alias;
		$rootScope.goBack();
	};
});
