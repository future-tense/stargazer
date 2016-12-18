/* global angular */

angular.module('app')
.directive('advancedToggle', function () {
	'use strict';

	return {
		require: 'ngModel',
		link: function(scope, element, attributes, ngModel) {

			scope.flag = ngModel.$viewValue;

			scope.toggle = function () {
				scope.flag = !scope.flag;
				ngModel.$setViewValue(scope.flag);
			};
		},
		templateUrl: 'app/core/templates/advanced-toggle.html'
	};

});
