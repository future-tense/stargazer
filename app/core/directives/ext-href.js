/* global angular, console */

angular.module('app')
.directive('extHref', function (platformInfo) {
	'use strict';

	return {
		restrict: 'A',
		link: link
	};

	function link(scope, element, attributes) {
		const url = attributes.extHref;
		if (platformInfo.isCordova) {
			element[0].onclick = onclick;
		} else {
			element[0].href = url;
		}

		function onclick() {
			window.open(url, '_system');
			return false;
		}
	}
});
