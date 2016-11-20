/* global angular, console */

angular.module('app')
.controller('GlobalSettingsCtrl', function ($scope, Language) {
	'use strict';

	$scope.language = Language.getCurrentName();
});
