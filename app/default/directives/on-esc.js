/* global angular, console */

angular.module('app')
.directive('onEsc', function () {
	'use strict';

	return function (scope, element, attrs) {
		element.bind("keydown keypress keyup", function (event) {
			if (event.which === 27) {
				scope.$apply(function () {
					scope.$eval(attrs.onEsc);
				});
				event.preventDefault();
			}
		});
	};
});
