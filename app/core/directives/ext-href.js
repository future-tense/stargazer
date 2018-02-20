/* global angular, require */

angular.module('app')
.directive('extHref', function (platformInfo) {
	'use strict';

	return {
		restrict: 'A',
		link: link
	};

	function link(scope, element, attributes) {

		const url = attributes.extHref;
		element[0].onclick = () => {
			if (platformInfo.isCordova) {
				window.open(url, '_system');
			} else {
				require('electron').shell.openExternal(url);
			}
			return false;
		};
	}
});
