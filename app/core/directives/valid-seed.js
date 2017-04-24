/* global angular, StellarSdk */

angular.module('app')
.directive('validSeed', function () {
	'use strict';

    return {
        require: 'ngModel',
        link: function (scope, element, attributes, ngModel) {
            ngModel.$validators.validSeed = function (modelValue) {
				return StellarSdk.StrKey.isValidEd25519SecretSeed(modelValue);
            };
		}
    };

});
