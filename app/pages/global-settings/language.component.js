
import language from '../../core/services/language.js';

export default class LanguageController {

	/* @ngInject */
	constructor($rootScope) {

		this.$rootScope = $rootScope;
		this.choice		= language.getCurrent();
		this.languages	= language.getLanguages();
	}

	setLanguage(code) {
		language.setCurrent(code);
		this.$rootScope.$broadcast('languageChange');
		this.$rootScope.goBack();
	}
}
