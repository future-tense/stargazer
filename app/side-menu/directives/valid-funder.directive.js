/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

angular.module('app.directive.valid-funder', [])
.directive('validFunder', function (Wallet) {
	'use strict';

	return {
		require: 'ngModel',
		scope: {
			network: '='
		},
		link: function (scope, element, attributes, ngModel) {
			ngModel.$validators.validFunder = function (name) {

				if (!name) {
					return true;
				}

				return Wallet.hasAccount(name, scope.network);
			};
		}
	};
});
