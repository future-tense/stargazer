/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

angular.module('app.filter.translate', [
	'app.service.translate'
])
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



