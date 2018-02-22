/* global angular, console */

import 'ionic-sdk/release/js/ionic.bundle';

angular.module('app.directive.on-esc', [])
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
