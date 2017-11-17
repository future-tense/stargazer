angular.module('app')
.factory('QRScanner', function ($ionicLoading, $q, Modal, platformInfo, Translate) {
	'use strict';

	const isCordova	= platformInfo.isCordova;
	const isWP		= platformInfo.isWP;
	const isIOS		= platformInfo.isIOS;

	return {
		open: isCordova ? cordovaOpenScanner : modalOpenScanner
	};

	function cordovaOpenScanner() {

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
	}

	function modalOpenScanner() {
		return Modal.show('app/core/modals/scanner.html');
	}
});
