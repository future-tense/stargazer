/* global angular, console */

import 'ionic-sdk/release/js/ionic.bundle';

angular.module('app.modal.remove-password', [])
.controller('RemovePasswordCtrl', function ($scope) {
	'use strict';

	$scope.form  = {};
	$scope.model = {};
	$scope.signer = $scope.data.signer;

	$scope.removePassword = function () {
		if ($scope.form.passwordForm.$valid) {
			$scope.modalResolve($scope.model.password);
		}
	};

	$scope.cancel = function () {
		$scope.closeModalService();
	};
});
