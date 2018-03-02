/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';
import language from '../../core/services/language.js';

import globalSettingsTemplate from './global-settings.html';

class GlobalSettingsController {
	constructor() {
		this.language = language.getCurrentName();
	}
}

angular.module('app.component.global-settings', [])
.component('globalSettings', {
	controller: GlobalSettingsController,
	controllerAs: 'vm',
	template: globalSettingsTemplate
});
