/* global angular, console */

angular.module('app')
.controller('RemovePasswordCtrl', function ($scope) {
	'use strict';

	$scope.form  = {};
	$scope.model = {};

	$scope.removePassword = function () {
		if ($scope.form.passwordForm.$valid) {
			$scope.modalResolve($scope.model.password);
		}
	};

	$scope.cancel = function () {
		$scope.closeModalService();
	};
});
