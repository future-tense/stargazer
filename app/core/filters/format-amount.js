/* global angular, console */

import 'ionic-sdk/release/js/ionic.bundle';
import language from '../../core/services/language.js';

angular.module('app.filter.format-amount', [])
.filter('formatAmount', function () {
	'use strict';

	return function (number) {
		const parts = number.split('.');
		if (parts.length === 2) {
			let numDecimals = parts[1].length;
			while (parts[1][numDecimals - 1] === '0') {
				numDecimals -= 1;
			}
			return parseFloat(number).toLocaleString(language.getLocale(), {
				minimumFractionDigits: numDecimals,
				maximumFractionDigits: numDecimals
			});
		} else {
			return parseInt(parts[0]).toLocaleString(language.getLocale());
		}
	};
});
