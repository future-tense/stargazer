/* global angular, console */

import 'ionic-sdk/release/js/ionic.bundle';

angular.module('app.directive.focus-if', [])
.directive('focusIf', function ($timeout) {
	'use strict';

	return {
		link: function (scope, element, attrs) {
			attrs.$observe('focusIf', val => {
				$timeout(() => {
					if (val) {
						element[0].focus();
					} else {
						element[0].blur();
					}
				});
			});
		}
	};

});
