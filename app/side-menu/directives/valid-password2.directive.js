/* global angular*/

angular.module('app')
.directive('validPassword2', function (Keychain) {
	'use strict';

	return {
		require: 'ngModel',
		link: function (scope, element, attributes, ngModel) {

			ngModel.$validators.validPassword = function (modelValue) {
				if (modelValue) {
					return Keychain.isValidPassword(attributes.seed, modelValue);
				} else {
					return false;
				}
			};
		}
	};
});
