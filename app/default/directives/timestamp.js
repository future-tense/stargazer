
/* global angular */

angular.module('app')
.directive('timestamp', function ($interval, $translate) {
	'use strict';

	function link(scope, element, attrs) {

		function updateTime() {
			var now = new Date().getTime() / 1000;
			var delta = now - attrs.time;

			var message;
			if (delta < 60) {
				message = 'timestamp.seconds';
			}
			else if (delta < 3600) {
				delta /= 60;
				message = 'timestamp.minutes';
			}
			else if (delta < 86400) {
				delta /= 3600;
				message = 'timestamp.hours';
			}
			else {
				delta /= 86400;
				message = 'timestamp.days';
			}

			var d = Math.floor(delta);
			$translate(message, {RES: d}, 'messageformat')
			.then(function (res){
				element.text(res);
			});
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
