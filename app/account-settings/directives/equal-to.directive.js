/* global angular, console */

import 'ionic-sdk/release/js/ionic.bundle';

angular.module('app.directive.equal-to', [])
.directive('equalTo', function () {
	'use strict';

	return {
		require: 'ngModel',
		scope: {
			otherModelValue: '=equalTo'
		},
		link: function (scope, element, attributes, ngModel) {
			ngModel.$validators.equalTo = function (modelValue) {
				return modelValue === scope.otherModelValue;
			};

			scope.$watch('otherModelValue', () => ngModel.$validate());
		}
	};

});
