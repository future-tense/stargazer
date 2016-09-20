/* global angular, StellarSdk */

angular.module('app')
.directive('validSeed', function () {
	'use strict';

    return {
        require: 'ngModel',
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.validSeed = function(modelValue) {
				try {
					var keypair = StellarSdk.Keypair.fromSeed(modelValue);
					return true;
				} catch (error) {
					return false;
				}
            };
		}
    };

});
