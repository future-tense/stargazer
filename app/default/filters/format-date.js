/* global angular */

angular.module('app')
.filter('formatDate', function (Language) {
	'use strict';

	var options = {
		year:	'numeric',
		month:	'numeric',
		day:	'numeric',
		hour:	'2-digit',
		minute:	'2-digit',
		second:	'2-digit'
	};

	return function (string) {
		var date = new Date(string);
		return date.toLocaleDateString(Language.getLocale(), options);
	};
});



