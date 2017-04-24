/* global angular */

angular.module('app')
.filter('formatDate', function (Language) {
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
		return date.toLocaleDateString(Language.getLocale(), options);
	};
});



