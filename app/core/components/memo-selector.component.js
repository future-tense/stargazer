/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

import memoSelectorTemplate from './memo-selector.html';

const types = [
	{name: 'memotype.none',		value: null},
	{name: 'memotype.id',		value: 'id'},
	{name: 'memotype.text',		value: 'text'},
	{name: 'memotype.hash',		value: 'hash'},
	{name: 'memotype.return',	value: 'return'}
];

class MemoSelectorController {
	constructor($scope) {

		this.memoTypes = types;

		$scope.$watch(() => this.req, newVal => {
			if (newVal) {
				this.memoTypes = types.filter(item => item.value === this.type);
			} else {
				this.memoTypes = types;
			}
		});
	}
}

angular.module('app.component.memo-selector', [])
.component('memoSelector', {
	bindings: {
		type: '=',
		memo: '=',
		req: '='
	},
	controller: MemoSelectorController,
	controllerAs: 'vm',
	template: memoSelectorTemplate
});
