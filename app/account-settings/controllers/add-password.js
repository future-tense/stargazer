/* global angular, console */

angular.module('app')
.controller('AddPasswordCtrl', function ($scope) {
	'use strict';

	$scope.model = {};
	$scope.confirm = false;
	$scope.heading = 'modal.password.set';

	$scope.setPassword = function () {
		$scope.heading = 'modal.password.confirm';
		$scope.confirm = true;
	};

	$scope.confirmPassword = function () {
		$scope.modalResolve($scope.model.password);
	};

	$scope.cancel = function () {
		$scope.closeModalService();
	};
});
