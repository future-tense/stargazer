/* global angular, console */

angular.module('app')
.directive('extHref', function (platformInfo) {
	'use strict';

	return {
		restrict: 'A',
		link: function (scope, element, attributes) {

			var url = attributes.extHref;
			function onclick() {
				window.open(url, '_system');
				return false;
			}

			if (platformInfo.isCordova) {
				element[0].onclick = onclick;
			} else {
				element[0].href = url;
			}
		}
	};
});
