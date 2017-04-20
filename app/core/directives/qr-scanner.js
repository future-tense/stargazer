/* global angular, cloudSky, cordova */

angular.module('app')
.directive('qrScanner', function ($ionicLoading, $rootScope, $timeout, $translate, Modal, platformInfo) {
	'use strict';

	return {
		restrict: 'E',
		scope: {
			onScan: "&"
		},
		controller: controller,
		replace: true,
		template: '<a id="camera-icon" class="p10" ng-click="openScanner()"><i class="icon-scan size-21"></i></a>'
	};

	function controller($scope) {

		const isCordova	= platformInfo.isCordova;
		const isWP		= platformInfo.isWP;
		const isIOS		= platformInfo.isIOS;

		$scope.openScanner = isCordova? cordovaOpenScanner : modalOpenScanner;

		function cordovaOpenScanner() {

			const text = $translate.instant('modal.scanner.preparing');
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

			function onSuccess(result) {
				$ionicLoading.hide();
				if (isWP && result.cancelled) {
					return;
				}

				const data = isIOS ? result : result.text;
				$scope.onScan({
					data: data
				});
			}

			function onError(error) {
				$ionicLoading.hide();
			}
		}

		function modalOpenScanner() {
			Modal.show('app/core/modals/scanner.html')
			.then(function (data) {
				$scope.onScan({
					data: data
				});
			});
		}
	}
});
