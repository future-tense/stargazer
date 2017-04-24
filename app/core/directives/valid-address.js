/* global angular */

angular.module('app')
.directive('validAddress', function ($parse, Destination) {
	'use strict';

    return {
        require: 'ngModel',
        link: function (scope, element, attributes, ngModel) {

			//
			//	validate address in ng-model, and set value of valid-address
			//	attribute to destInfo if valid
			//

			ngModel.$asyncValidators.validAddress = function (address) {

				const setter = $parse(attributes.validAddress).assign;
				setter(scope, null);

				return Destination.lookup(address)
				.then(res => {
					setter(scope, res);
					return true;
				});
			};
		}
    };
});
