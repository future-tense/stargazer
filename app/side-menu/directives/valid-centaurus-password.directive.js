/* global angular*/

angular.module('app')
.directive('validCentaurusPassword', function (CentaurusService) {
	'use strict';

	return {
		require: 'ngModel',
		link: function (scope, element, attributes, ngModel) {

			ngModel.$validators.validPassword = function (modelValue) {
				if (modelValue) {
					return CentaurusService.isValidPassword(attributes.cipher, modelValue);
				} else {
					return false;
				}
			};
		}
	};
});
