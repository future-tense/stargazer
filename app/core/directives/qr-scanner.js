/* global angular, cloudSky, cordova */

angular.module('app')
.directive('qrScanner', function ($ionicLoading, $rootScope, $timeout, $translate, Modal, platformInfo) {
	'use strict';

	var isCordova	= platformInfo.isCordova;
	var isWP		= platformInfo.isWP;
	var isIOS		= platformInfo.isIOS;

	var controller = function ($scope) {

		var onSuccess = function (result) {
			$ionicLoading.hide();
			if (isWP && result.cancelled) {
				return;
			}

			var data = isIOS ? result : result.text;
			$scope.onScan({
				data: data
			});
		};

		var onError = function (error) {
			$ionicLoading.hide();
		};

		$scope.cordovaOpenScanner = function () {

			var text = $translate.instant('modal.scanner.preparing');
			return $ionicLoading.show({
				template: text
			})
			.then(function () {
				if (isIOS) {
					cloudSky.zBar.scan({}, onSuccess, onError);
				} else {
					cordova.plugins.barcodeScanner.scan(onSuccess, onError, {
						resultDisplayDuration: 0,
						formats : "QR_CODE"
					});
				}
			});
		};

		$scope.modalOpenScanner = function () {
			Modal.show('app/core/modals/scanner.html', $scope);
		};

		$scope.openScanner = function () {
			if (isCordova) {
				$scope.cordovaOpenScanner();
			} else {
				$scope.modalOpenScanner();
			}
		};
	};

	return {
		restrict: 'E',
		scope: {
			onScan: "&"
		},
		controller: controller,
		replace: true,
		template: '<a id="camera-icon" class="p10" ng-click="openScanner()"><i class="icon-scan size-21"></i></a>'
	};
});
