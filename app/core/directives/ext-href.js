/* global angular, require */

import 'ionic-sdk/release/js/ionic.bundle';
import platformInfo from '../../core/services/platform-info.js';

angular.module('app.directive.ext-href', [])
.directive('extHref', function () {
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
