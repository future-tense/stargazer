/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';
import language from '../../core/services/language.js';

angular.module('app.filter.format-date', [])
.filter('formatDate', function () {
	'use strict';

	const options = {
		year:	'numeric',
		month:	'numeric',
		day:	'numeric',
		hour:	'2-digit',
		minute:	'2-digit',
		second:	'2-digit'
	};

	return function (string) {
		const date = new Date(string);
		return date.toLocaleDateString(language.getLocale(), options);
	};
});



