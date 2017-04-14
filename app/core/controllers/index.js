/* global angular, */

angular.module('app')
.controller('IndexCtrl', function ($scope, $window, Commands) {
	'use strict';

	$scope.onQrCodeScanned		= Commands.onQrCodeScanned;
	$scope.physicalScreenWidth	= $window.innerWidth;

	angular.element($window).bind('resize', updateWidth);
	function updateWidth() {
		$scope.physicalScreenWidth = $window.innerWidth;
	}
});
