/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';
import jazzicon from '../../core/services/jazzicon.js';

angular.module('app.directive.jazzicon', [])
.directive('jazzicon', function () {
	'use strict';

	return {
		restrict: 'E',
		link: link
	};

	function link(scope, element, attributes) {
		const el = jazzicon.render(attributes.seed);
		element[0].appendChild(el);
	}
});
