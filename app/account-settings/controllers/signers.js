/* global angular, console */

angular.module('app')
.controller('AccountSignersCtrl', function ($rootScope, $scope, Wallet) {
	'use strict';

	$scope.account = Wallet.current;

	$scope.getSigners = function () {
		return $scope.account.signers.filter(signer => signer.weight !== 0);
	};
});
