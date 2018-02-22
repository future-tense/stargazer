/* global angular, qrcode */

import 'ionic-sdk/release/js/ionic.bundle';
import 'jsqrcode';		//	https://github.com/keifergu/jsqrcode

angular.module('app.service.qr-decoder', [])
.factory('QRDecoder', function ($q) {
	'use strict';

	let prevResult;

	return {
		decode: decode
	};

	function decode() {
		const deferred = $q.defer();
		qrcode.callback = function (data) {
			if (prevResult !== data) {
				prevResult = data;
				return;
			}
			deferred.resolve(data);
		};

		qrcode.decode();
		return deferred.promise;
	}
});
