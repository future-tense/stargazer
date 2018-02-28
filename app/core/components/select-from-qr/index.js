/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';
import qrScannerModule from '../qr-scanner';
import SelectFromQrController from './select-from-qr.controller';

export default angular.module('selectFromQRModule', [
	qrScannerModule.name
])
.component('selectFromQr', {
	bindings: {
		network: '=',
		destination: '='
	},
	controller: SelectFromQrController,
	controllerAs: 'vm',
	templateUrl: 'app/core/components/select-from-qr/select-from-qr.html'
});

