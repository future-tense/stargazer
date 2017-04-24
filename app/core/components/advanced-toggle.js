/* global angular */

(function () {
	'use strict';

	function controller() {
		this.toggle = () => {
			this.flag = !this.flag;
		};
	}

	angular.module('app')
	.component('advancedToggle', {
		bindings: {
			flag: '='
		},
		controller: controller,
		controllerAs: 'vm',
		templateUrl: 'app/core/templates/advanced-toggle.html'
	});
}());
