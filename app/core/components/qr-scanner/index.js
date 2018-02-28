
/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

import qrScannerDirective from './qr-scanner.directive.js';
import qrScannerService from './qr-scanner.service.js';
import scannerModalController from './scanner.controller.js';

export default angular.module('qrScannerModule', [])
.directive('qrScanner', qrScannerDirective)
.factory('QRScanner', qrScannerService)
.controller('scannerModalController', scannerModalController);
