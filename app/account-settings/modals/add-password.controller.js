/* global angular, console */

import 'ionic-sdk/release/js/ionic.bundle';

angular.module('app.modal.add-password', [])
.controller('AddPasswordCtrl', function ($scope) {
	'use strict';

	$scope.form = {};
	$scope.model = {};
	$scope.confirm = false;
	$scope.heading = 'modal.password.set';

	$scope.setPassword = function () {
		$scope.heading = 'modal.password.confirm';
		$scope.confirm = true;
	};

	$scope.confirmPassword = function () {
		if ($scope.form.confirmForm.$valid) {
			$scope.modalResolve($scope.model.password);
		}
	};

	$scope.cancel = function () {
		$scope.closeModalService();
	};
});
