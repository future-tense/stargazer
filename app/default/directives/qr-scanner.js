/* global angular, cloudSky, cordova */

angular.module('app')
.directive('qrScanner', function($rootScope, $timeout, $translate, Modal, platformInfo) {
	'use strict';

	var isCordova	= platformInfo.isCordova;
	var isWP		= platformInfo.isWP;
	var isIOS		= platformInfo.isIOS;

	var controller = function($scope) {

		var onSuccess = function(result) {
			$timeout(100).then(window.plugins.spinnerDialog.hide);

			if (isWP && result.cancelled) {
				return;
			}

			$timeout(1000)
			.then(function() {
				var data = isIOS ? result : result.text;
				$scope.onScan({
					data: data
				});
			});
		};

		var onError = function(error) {
			$timeout(100).then(window.plugins.spinnerDialog.hide);
		};

		$scope.cordovaOpenScanner = function() {

			$translate('modal.scanner.preparing')
			.then(function (res) {
				window.plugins.spinnerDialog.show(null, res, true);
				return $timeout(100);
			})
			.then(function () {
				if (isIOS) {
					cloudSky.zBar.scan({}, onSuccess, onError);
				} else {
					cordova.plugins.barcodeScanner.scan(onSuccess, onError);
				}
				if ($scope.beforeScan) {
					$scope.beforeScan();
				}
			});
		};

		$scope.modalOpenScanner = function() {
			Modal.show('app/default/modals/scanner.html', $scope);
		};

		$scope.openScanner = function() {
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
			onScan: "&",
			beforeScan: "&"
		},
		controller: controller,
		replace: true,
		template: '<a id="camera-icon" class="p10" ng-click="openScanner()"><i class="icon-scan size-21"></i></a>'
	};
});
