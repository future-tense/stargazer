/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

angular.module('app.directive.valid-password', [])
.directive('validPassword', function (Keychain) {
	'use strict';

	return {
		require: 'ngModel',
		link: function (scope, element, attributes, ngModel) {
			ngModel.$validators.validPassword = function (modelValue) {
				if (modelValue) {
					return Keychain.isValidPasswordForSigner(attributes.signer, modelValue);
				} else {
					return false;
				}
			};
		}
	};

});
