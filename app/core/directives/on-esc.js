/* global angular, console */

angular.module('app')
.directive('onEsc', function () {
	'use strict';

	return function (scope, element, attrs) {
		element.bind('keydown keypress keyup', event => {
			if (event.which === 27) {
				scope.$apply(() => scope.$eval(attrs.onEsc));
				event.preventDefault();
			}
		});
	};
});
