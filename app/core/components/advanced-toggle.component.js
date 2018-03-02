/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

import advancedToggleTemplate from './advanced-toggle.html';

class AdvancedToggleController {
	toggle() {
		this.flag = !this.flag;
	}
}

angular.module('app.component.advanced-toggle', [])
.component('advancedToggle', {
	bindings: {
		flag: '='
	},
	controller: AdvancedToggleController,
	controllerAs: 'vm',
	template: advancedToggleTemplate
});
