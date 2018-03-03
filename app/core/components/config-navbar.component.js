/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

import configNavbarTemplate from './config-navbar.html';

class ConfigNavbarController {

	constructor($rootScope) {
		this.$rootScope = $rootScope;
	}

	goBack() {
		this.$rootScope.goBack();
	}
}

angular.module('app.component.config-navbar', [])
.component('configNavbar', {
	bindings: {
		heading: '@',
		back: '@'
	},
	controller: ConfigNavbarController,
	controllerAs: 'vm',
	template: configNavbarTemplate
});

