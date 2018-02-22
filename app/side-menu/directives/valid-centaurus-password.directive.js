/* global angular*/

import 'ionic-sdk/release/js/ionic.bundle';
import centaurus from '../../core/services/centaurus.js';

angular.module('app.directive.valid-centaurus-password', [])
.directive('validCentaurusPassword', function () {
	'use strict';

	return {
		require: 'ngModel',
		link: function (scope, element, attributes, ngModel) {

			ngModel.$validators.validPassword = function (modelValue) {
				if (modelValue) {
					return centaurus.isValidPassword(attributes.cipher, modelValue);
				} else {
					return false;
				}
			};
		}
	};
});
