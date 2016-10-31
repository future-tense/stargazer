/* global angular */

angular.module('app')
.filter('formatAmount', function () {
	'use strict';

	var formatter = new Intl.NumberFormat("en-US");

	return function (number) {
		number = (number * 1).toString();
		var parts = number.split(".");
		return formatter.format(parts[0]) + (parts[1] ? "." + parts[1] : "");
	};
});
