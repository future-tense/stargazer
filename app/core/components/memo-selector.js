/* global angular */

(function () {
	'use strict';

	const memoTypes = [
		{name: 'memotype.none',		value: null},
		{name: 'memotype.id',		value: 'id'},
		{name: 'memotype.text',		value: 'text'},
		{name: 'memotype.hash',		value: 'hash'},
		{name: 'memotype.return',	value: 'return'}
	];

	function controller() {
		this.memoTypes = memoTypes;
	}

	angular.module('app')
	.component('memoSelector', {
		bindings: {
			type: '=',
			memo: '='
		},
		controller: controller,
		controllerAs: 'vm',
		templateUrl: 'app/core/templates/memo-selector.html'
	});
}());
