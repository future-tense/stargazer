/* global angular, console, QRCode */

angular.module('app')
.directive('qrcode', function ($window) {
	'use strict';

	function link(scope, element, attrs) {

		var qrcode = null;
		function renderCode(text) {

			if (qrcode) {
				qrcode.clear();
			}

			if (!text) {
				return;
			}

			var styles = $window.getComputedStyle(element[0], null);
			var width = styles.width.slice(0, -2);
			var height = styles.height.slice(0, -2);

			qrcode = new QRCode('qrcode_' + scope.$id, {
				text: text,
				width: width,
				height: height,
				colorDark : "#000000",
				colorLight : "#ffffff",
				correctLevel : QRCode.CorrectLevel.L
			});
			qrcode._el.title = '';
		}

		scope.$watch('text', function () {
			renderCode(scope.text);
		});
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
