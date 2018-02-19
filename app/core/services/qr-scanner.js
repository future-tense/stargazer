/* global angular */

angular.module('app')
.factory('QRScanner', function ($ionicLoading, $q, Modal, platformInfo, Translate) {
	'use strict';

	const isCordova	= platformInfo.isCordova;
	const isWP		= platformInfo.isWP;
	const isIOS		= platformInfo.isIOS;

	const hasCamera = () => {
		if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
			return navigator.mediaDevices.enumerateDevices()
			.then(devices => devices.filter(device => device.kind === 'videoinput').length)
			.catch(err => 0)
			.then(res => (res !== 0));
		} else {
			return $q.when(false);
		}
	};

	const cordovaOpenScanner = () => {

		const text = Translate.instant('modal.scanner.preparing');
		return $ionicLoading.show({
			template: text
		})
		.then(() => $q((resolve, reject) => {
			function onSuccess(result) {
				$ionicLoading.hide();
				const data = isIOS ? result : result.text;
				resolve(data);
			}

			function onError(error) {
				$ionicLoading.hide();
				reject();
			}

			if (isIOS) {
				cloudSky.zBar.scan({}, onSuccess, onError);
			} else {
				cordova.plugins.barcodeScanner.scan(onSuccess, onError, {
					resultDisplayDuration: 0,
					formats: 'QR_CODE'
				});
			}
		}));
	};

	const modalOpenScanner = () => Modal.show('app/core/modals/scanner.html');

	//
	//	:KLUDGE:	ng-show doesn't seem to evaluate the value of the promise itself
	//

	const test = (promise) => () => promise.$$state.value;

	return {
		hasCamera: test(hasCamera()),
		open: isCordova ? cordovaOpenScanner : modalOpenScanner
	};
});
