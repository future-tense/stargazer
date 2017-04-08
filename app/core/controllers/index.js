/* global angular, console, StellarSdk */

angular.module('app')
.controller('IndexCtrl', function ($ionicBody, $ionicPopup, $rootScope, $scope, $translate, $window, Commands) {
	'use strict';

	$scope.onQrCodeScanned		= Commands.onQrCodeScanned;
	$scope.physicalScreenWidth	= $window.innerWidth;

	$rootScope.$on('$submitter.failed', onSubmitterFailed);
	angular.element($window).bind('resize', updateWidth);

	function onSubmitterFailed(event, err) {
		$ionicPopup.alert({
			title: $translate.instant(err)
		})
		.then(function () {
			//	:KLUDGE: ionic 1.3.2 messes up, so we have to manually remove this
			$ionicBody.removeClass('modal-open');
		});
	}

	function updateWidth() {
		$scope.physicalScreenWidth = $window.innerWidth;
	}
});
