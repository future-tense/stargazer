/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

angular.module('app.directive.valid-address', [])
.directive('validAddress', function ($parse, Destination) {
	'use strict';

    return {
        require: 'ngModel',
        scope: {
        	validAddress: '&'
		},
        link: link
    };

	function link(scope, element, attributes, ngModel) {

		//
		//	validate address in ng-model, and pass the destInfo to
		//  callback specified in the valid-address attribute, if valid
		//

		ngModel.$asyncValidators.validAddress = function (address) {
			return Destination.lookup(address)
			.then(res => {
				scope.validAddress({res: res});
				return true;
			})
			.catch(err => {
				scope.validAddress(null);
				return false;
			});
		};
	}
});
