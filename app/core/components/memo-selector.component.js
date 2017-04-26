/* global angular */

(function () {
	'use strict';

	class MemoSelectorController {
		constructor() {
			this.memoTypes = [
				{name: 'memotype.none',		value: null},
				{name: 'memotype.id',		value: 'id'},
				{name: 'memotype.text',		value: 'text'},
				{name: 'memotype.hash',		value: 'hash'},
				{name: 'memotype.return',	value: 'return'}
			];
		}
	}

	angular.module('app')
	.component('memoSelector', {
		bindings: {
			type: '=',
			memo: '='
		},
		controller: MemoSelectorController,
		controllerAs: 'vm',
		templateUrl: 'app/core/components/memo-selector.html'
	});
}());
