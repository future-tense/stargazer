/* global angular, console */

angular.module('app')
.controller('DeleteAccountCtrl', function ($location, $scope, Wallet) {
	'use strict';

	$scope.account = Wallet.current;

	$scope.delete = function () {
		Wallet.removeAccount(Wallet.current);
		$location.path('/');
	};
});
