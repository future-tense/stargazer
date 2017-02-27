/* global angular, StellarSdk */

angular.module('app')
.directive('validPassword', function (Keychain) {
	'use strict';

	return {
		require: 'ngModel',
		link: function(scope, element, attributes, ngModel) {
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
