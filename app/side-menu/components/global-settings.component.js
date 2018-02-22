/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

(function () {
	'use strict';

	class GlobalSettingsController {
		constructor(Language) {
			this.language = Language.getCurrentName();
		}
	}

	angular.module('app.component.global-settings', [])
	.component('globalSettings', {
		controller: GlobalSettingsController,
		controllerAs: 'vm',
		templateUrl: 'app/side-menu/components/global-settings.html'
	});
}());
