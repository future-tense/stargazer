/* global angular, console */

angular.module('app')
.directive('onEnter', function () {
	'use strict';

	return function (scope, element, attrs) {
		element.bind("keydown keypress keyup", function (event) {
			if (event.which === 13) {
				scope.$apply(function () {
					scope.$eval(attrs.onEnter);
				});
				event.preventDefault();
			}
		});
	};
});
