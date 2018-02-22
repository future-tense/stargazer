/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';
import language from '../../core/services/language.js';

class GlobalSettingsController {
	constructor() {
		this.language = language.getCurrentName();
	}
}

angular.module('app.component.global-settings', [])
.component('globalSettings', {
	controller: GlobalSettingsController,
	controllerAs: 'vm',
	templateUrl: 'app/side-menu/components/global-settings.html'
});
