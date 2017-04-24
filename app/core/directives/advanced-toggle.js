/* global angular */

angular.module('app')
.directive('advancedToggle', function () {
	'use strict';

	return {
		require: 'ngModel',
		link: link,
		templateUrl: 'app/core/templates/advanced-toggle.html'
	};

	function link(scope, element, attributes, ngModel) {

		scope.flag = ngModel.$viewValue;

		scope.toggle = function () {
			scope.flag = !scope.flag;
			ngModel.$setViewValue(scope.flag);
		};
	}
});
