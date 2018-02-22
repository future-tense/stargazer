/* global angular, console */

import 'ionic-sdk/release/js/ionic.bundle';

angular.module('app.modals.submit-password', [])
.controller('SubmitPasswordCtrl', function ($scope, Wallet) {
	'use strict';

	$scope.form = {};
	$scope.model = {};

	let signer = $scope.data.signer;
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
		if ($scope.form.passwordForm.$valid) {
			$scope.modalResolve($scope.model.password);
		}
	};

	$scope.cancel = function () {
		$scope.closeModalService();
	};
});
