/* global angular */

angular.module('app')
.directive('validAddress', function (DestinationCache) {
	'use strict';

    return {
        require: 'ngModel',
        link: function(scope, element, attributes, ngModel) {
			ngModel.$asyncValidators.validAddress = DestinationCache.lookup;
		}
    };

});
