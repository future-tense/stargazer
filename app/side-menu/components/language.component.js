/* global angular, console, StellarSdk */

(function () {
	'use strict';

	class LanguageController {

		constructor($rootScope, Language) {

			this.$rootScope = $rootScope;
			this.Language = Language;

			this.choice		= Language.getCurrent();
			this.languages	= Language.getLanguages();
		}

		setLanguage(code) {
			this.Language.setCurrent(code);
			this.$rootScope.goBack();
		}
	}

	angular.module('app')
	.component('language', {
		controller: LanguageController,
		controllerAs: 'vm',
		templateUrl: 'app/side-menu/components/language.html'
	});
}());
