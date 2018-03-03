/* global */

import qrcode from 'esqrcode';

let prevResult;

const decode = () => new Promise((resolve, reject) => {
	qrcode.callback = data => {
		if (prevResult !== data) {
			prevResult = data;
		} else {
			resolve(data);
		}
	};

	qrcode.decode();
});

export default /* @ngInject */ function ($scope, $timeout) {

	$scope.init		= init;
	$scope.cancel	= cancel;

	// QR code Scanner
	let context;
	let localMediaStream;
	let scanTimer;
	let video;

	const width  = 480;		// 300;
	const height = 320;		// 225;

	//		480*320

	function init() {
		setScanner();
		$timeout(() => {
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
				decode().then(data => {
					stopScanning();
					$scope.modalResolve(data);
				});
			} catch (exception) {
				console.log('exception', exception);
			}
		}
		scanTimer = $timeout(scan, 800);
	}

	function stopScanning() {
		$timeout.cancel(scanTimer);
		if (localMediaStream && localMediaStream.active) {
			localMediaStream.getTracks()
			.forEach(track => track.stop());
		} else {
			try {
				localMediaStream.stop();
			} catch (exception) {
				// Older Chromium not support the STOP function
			}
		}
		localMediaStream = null;
		video.src = '';
	}
}

