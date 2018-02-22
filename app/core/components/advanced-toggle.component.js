/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

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
	templateUrl: 'app/core/components/advanced-toggle.html'
});
