/* global angular */

angular.module('app')
.filter('translate', function (Translate) {
	'use strict';

	return function (string, data) {
		if (!data) {
			return Translate.instant(string);
		} else {
			return Translate.instant(string, data);
		}
	};
});



