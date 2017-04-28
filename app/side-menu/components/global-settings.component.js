/* global angular */

(function () {
	'use strict';

	class GlobalSettingsController {
		constructor(Language) {
			this.language = Language.getCurrentName();
		}
	}

	angular.module('app')
	.component('globalSettings', {
		controller: GlobalSettingsController,
		controllerAs: 'vm',
		templateUrl: 'app/side-menu/components/global-settings.html'
	});
}());
