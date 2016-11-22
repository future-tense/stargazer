/* global angular, console */

angular.module('app')
.controller('RemovePasswordCtrl', function ($scope) {
	'use strict';

	$scope.model = {};

	$scope.removePassword = function () {
		$scope.modalResolve($scope.model.password);
	};

	$scope.cancel = function () {
		$scope.closeModalService();
	};
});
