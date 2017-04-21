/* global angular */

angular.module('app')
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
