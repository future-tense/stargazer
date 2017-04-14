/* global angular */

angular.module('app')
.directive('jazzicon', function (Jazzicon) {
	'use strict';

	return {
		link: function (scope, element, attributes) {
			const el = Jazzicon.render(attributes.seed);
			element[0].appendChild(el);
		}
	};
});
