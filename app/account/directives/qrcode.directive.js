/* global angular, QRCode */

import 'ionic-sdk/release/js/ionic.bundle';
import QRCode from 'qrcode_js';

angular.module('app.directive.qrcode', [])
.directive('qrcode', function () {

	function link(scope, element, attrs) {

		let qrcode = null;
		function renderCode(text) {

			if (qrcode) {
				qrcode.clear();
			}

			if (!text) {
				return;
			}

			const styles = window.getComputedStyle(element[0], null);
			const width = styles.width.slice(0, -2);
			const height = styles.height.slice(0, -2);

			qrcode = new QRCode(`qrcode_${scope.$id}`, {
				text: text,
				width: width,
				height: height,
				colorDark : '#000000',
				colorLight : '#ffffff',
				correctLevel : QRCode.CorrectLevel.L
			});

			/* eslint-disable no-underscore-dangle */
			qrcode._el.title = '';
			/* eslint-enable no-underscore-dangle */
		}

		scope.$watch('text', () => renderCode(scope.text));
	}

	return {
		restrict: 'AE',
		scope: {
			text: '='
		},
		link: link,
		template: '<div id="qrcode_{{::$id}}"></div>'
	};
});
