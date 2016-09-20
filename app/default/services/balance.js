/* global angular, localStorage */

angular.module('app')
.factory('Balance', function ($rootScope) {
	'use strict';

	var _value = localStorage.getItem('balance');
	return {
		set value(x) {
			_value = (x > 0)? x: 0;
			localStorage.setItem('balance', x);
			$rootScope.$apply();
		},
		get value() {
			return _value;
		},
		clear: function () {
			_value = 0;
		}
	};
});
