/* global angular */

angular.module('app')
.factory('QRDecoder', function ($q) {
	'use strict';

	//	uses the jsqrcode bower component
	const qrcode = window.qrcode;
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
