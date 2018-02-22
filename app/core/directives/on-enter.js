/* global angular, console */

import 'ionic-sdk/release/js/ionic.bundle';

angular.module('app.directive.on-enter', [])
.directive('onEnter', function () {
	'use strict';

	return function (scope, element, attrs) {
		element.bind('keydown keypress keyup', event => {
			if (event.which === 13) {
				scope.$apply(() => scope.$eval(attrs.onEnter));
				event.preventDefault();
			}
		});
	};
});
