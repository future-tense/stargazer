/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';
import language from '../../core/services/language.js';

class LanguageController {

	constructor($rootScope) {

		this.$rootScope = $rootScope;
		this.choice		= language.getCurrent();
		this.languages	= language.getLanguages();
	}

	setLanguage(code) {
		language.setCurrent(code);
		this.$rootScope.goBack();
	}
}

angular.module('app.component.language', [])
.component('language', {
	controller: LanguageController,
	controllerAs: 'vm',
	templateUrl: 'app/side-menu/components/language.html'
});
