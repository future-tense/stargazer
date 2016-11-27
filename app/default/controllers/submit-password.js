/* global angular, console */

angular.module('app')
.controller('SubmitPasswordCtrl', function ($scope, Wallet) {
	'use strict';

	$scope.model = {};

	var signer = $scope.signer;
	if (signer === Wallet.current.id) {
		$scope.label = 'modal.password.label';
	}

	else {
		if (signer in Wallet.accounts) {
			signer = Wallet.accounts[signer].alias;
		}

		$scope.translationData = {
			key: signer
		};

		$scope.label = 'modal.password.keyname';
	}

	$scope.submitPassword = function () {
		$scope.modalResolve($scope.model.password);
	};

	$scope.cancel = function () {
		$scope.closeModalService();
	};
});
