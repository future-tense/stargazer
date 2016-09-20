/* global angular */

angular.module('app')
.filter('normalize', function () {
	'use strict';

	return function (number) {
		return (number * 1).toString();
	};
});
