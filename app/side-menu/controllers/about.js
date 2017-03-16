/* global angular, console */

angular.module('app')
.controller('AboutCtrl', function ($scope, platformInfo) {
	'use strict';

	$scope.android = platformInfo.isAndroid;
});
