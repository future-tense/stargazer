/* global angular */

(function () {
	'use strict';

	class AdvancedToggleController {
		toggle() {
			this.flag = !this.flag;
		}
	}

	angular.module('app')
	.component('advancedToggle', {
		bindings: {
			flag: '='
		},
		controller: AdvancedToggleController,
		controllerAs: 'vm',
		templateUrl: 'app/core/templates/advanced-toggle.html'
	});
}());
