/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

angular.module('app.directive.jazzicon', [])
.directive('jazzicon', function (Jazzicon) {
	'use strict';

	return {
		restrict: 'E',
		link: link
	};

	function link(scope, element, attributes) {
		const el = Jazzicon.render(attributes.seed);
		element[0].appendChild(el);
	}
});
