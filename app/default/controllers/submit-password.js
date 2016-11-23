/* global angular, console */

angular.module('app')
.controller('SubmitPasswordCtrl', function ($scope, Wallet) {
	'use strict';

	var signer = $scope.signer;
	if (signer in Wallet.accounts) {
		signer = Wallet.accounts[signer].alias;
	}

	$scope.keyName = signer;
	$scope.model = {};

	if (signer === Wallet.current.id) {
		$scope.label = 'modal.password.label';
	} else {
		$scope.label = 'modal.password.keyname';
	}

	$scope.translationData = {
		key: $scope.keyName
	};

	$scope.submitPassword = function () {
		$scope.modalResolve($scope.model.password);
	};

	$scope.cancel = function () {
		$scope.closeModalService();
	};
});
