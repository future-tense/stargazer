
/* global angular */

angular.module('app')
.directive('timestamp', function ($interval) {
	'use strict';

	function link(scope, element, attrs) {

		function updateTime() {
			var now = new Date().getTime() / 1000;
			var delta = now - attrs.time;

			function inner(delta, interval) {
				var d = Math.floor(delta);
				if (d !== 1) {
					interval += 's';
				}
				return d + ' ' + interval + ' ago';
			}

			var res;
			if (delta < 60) {
				res = inner(delta, 'second');
			}
			else if (delta < 3600) {
				delta /= 60;
				res = inner(delta, 'minute');
			}
			else if (delta < 86400) {
				delta /= 3600;
				res = inner(delta, 'hour');
			}
			else {
				delta /= 86400;
				res = inner(delta, 'day');
			}

			element.text(res);
		}

		updateTime();
		$interval(updateTime, 1000);
	}

	return {
		restrict: 'E',
		scope: {
			time: '@'
		},
		link: link
	};
});
