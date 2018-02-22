/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';
import translate from '../services/translate.service.js';

angular.module('app.filter.translate', [])
.filter('translate', function () {
	'use strict';

	return function (string, data) {
		if (!data) {
			return translate.instant(string);
		} else {
			return translate.instant(string, data);
		}
	};
});



