/* global angular, console */

angular.module('app')
.controller('GlobalSettingsCtrl', function ($scope, Language) {
	'use strict';

	$scope.flag = {
		isAdvanced: $scope.advanced
	};

	$scope.language = Language.getCurrentName();
});
