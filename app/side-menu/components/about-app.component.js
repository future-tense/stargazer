/* global angular, console */

(function () {
	'use strict';

	class AboutAppController {
		constructor(platformInfo) {
			this.isAndroid = platformInfo.isAndroid;
		}
	}

	angular.module('app')
	.component('aboutApp', {
		controller: AboutAppController,
		controllerAs: 'vm',
		templateUrl: 'app/side-menu/components/about-app.html'
	});
}());
