 /* global angular, qrcode */

angular.module('app')
.controller('scannerController', function ($scope, $timeout, QRDecoder) {
	'use strict';

	$scope.init		= init;
	$scope.cancel	= cancel;

	// QR code Scanner
	let context;
	let localMediaStream;
	let prevResult;
	let scanTimer;
	let video;

	const qrcode = window.qrcode;
	const width  = 480;		// 300;
	const height = 320;		// 225;

	//		480*320

	qrcode.callback = function (data) {
		if (prevResult !== data) {
			prevResult = data;
			return;
		}

		stopScanning();
		$scope.modalResolve(data);
	};

	function init() {
		setScanner();
		$timeout(function() {
			if ($scope.beforeScan) {
				$scope.beforeScan();
			}
			const canvas = document.getElementById('qr-canvas');
			context = canvas.getContext('2d');

			video = document.getElementById('qrcode-scanner-video');
			canvas.width = width;
			canvas.height = height;
			context.clearRect(0, 0, width, height);

			navigator.getUserMedia({
				video: true
			}, onSuccess, onError);
		}, 500);

		function onSuccess(stream) {
			video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
			localMediaStream = stream;
			video.play();
			$timeout(scan, 1000);
		}

		function onError(err) {
			cancel();
		}
	}

	function cancel() {
		stopScanning();
		$scope.closeModalService();
	}

	function setScanner() {
		navigator.getUserMedia = navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.msGetUserMedia;

		window.URL = window.URL ||
			window.webkitURL ||
			window.mozURL ||
			window.msURL;
	}

	function scan(evt) {
		if (localMediaStream) {
			context.drawImage(video, 0, 0, width, height);
			try {
				QRDecoder.decode()
				.then(function (data) {
					stopScanning();
					$scope.modalResolve(data);
				});
			} catch (e) {
				//qrcodeError(e);
			}
		}
		scanTimer = $timeout(scan, 800);
	}

	function stopScanning() {
		$timeout.cancel(scanTimer);
		if (localMediaStream && localMediaStream.active) {
			const localMediaStreamTrack = localMediaStream.getTracks();
			for (let i = 0; i < localMediaStreamTrack.length; i++) {
				localMediaStreamTrack[i].stop();
			}
		} else {
			try {
				localMediaStream.stop();
			} catch (e) {
				// Older Chromium not support the STOP function
			}
		}
		localMediaStream = null;
		video.src = '';
	}
});
