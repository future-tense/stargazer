/* global angular, console */

angular.module('app')
.filter('formatAmount', function (Language) {
	'use strict';

	return function (number) {
		var parts = (number * 1).toString().split('.');
		if (parts.length === 2) {
			var numDecimals = parts[1].length;
			return (number * 1).toLocaleString(Language.getLocale(), {
				minimumFractionDigits: numDecimals,
				maximumFractionDigits: numDecimals
			});
		} else {
			return parseInt(parts[0]).toLocaleString(Language.getLocale());
		}
	};
});
