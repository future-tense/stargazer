/* global angular, console */

angular.module('app')
.directive('equalTo', function () {
	'use strict';

	return {
		require: 'ngModel',
		scope: {
			otherModelValue: '=equalTo'
		},
		link: function(scope, element, attributes, ngModel) {
			ngModel.$validators.equalTo = function(modelValue) {
				return modelValue === scope.otherModelValue;
			};

			scope.$watch('otherModelValue', function() {
				ngModel.$validate();
			});
		}
	};

});
