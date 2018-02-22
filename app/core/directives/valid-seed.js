/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';
import StellarSdk from 'stellar-sdk';

angular.module('app.directive.valid-seed', [])
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
