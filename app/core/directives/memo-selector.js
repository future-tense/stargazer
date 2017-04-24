/* global angular */

angular.module('app')
.directive('memoSelector', function () {
	'use strict';

	return {
		scope: {
			type: '=',
			memo: '='
		},
		link: function (scope, element, attributes) {
			scope.memoTypes = [
				{name: 'memotype.none',		value: null},
				{name: 'memotype.id',		value: 'id'},
				{name: 'memotype.text',		value: 'text'},
				{name: 'memotype.hash',		value: 'hash'},
				{name: 'memotype.return',	value: 'return'}
			];
		},
		templateUrl: 'app/core/templates/memo-selector.html'
	};

});
