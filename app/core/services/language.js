/* global angular */

angular.module('app')
.factory('Language', function ($translate, Storage) {
	'use strict';

	const languages = {
		en: {
			name:	'English',
			locale:	'en-US'
		},
		es: {
			name:	'Español',
			locale:	'es-ES'
		},
		fil: {
			name:	'Pilipino',
			locale:	'fil-PH'
		},
		fr: {
			name:	'Français',
			locale:	'fr-FR'
		},
		hi: {	/* hindi */
			name:	'हिन्दी',
			locale:	'hi-IN'
		},
		id: {
			name:	'Bahasa Indonesia',
			locale: 'id-ID'
		},
		pl: {
			name:	'Polski',
			locale:	'pl-PL'
		},
		sv: {
			name:	'Svenska',
			locale:	'sv-SE'
		},
		zh: {	/* chinese */
			name:	'中文',
			locale:	'zh-CN'
		}
	};

	let current = Storage.getItem('language') || 'en';

	function setCurrent(code) {
		current = code;
		Storage.setItem('language', code);
		$translate.use(code);
	}

	setCurrent(current);

	return {
		getLocale: function () {
			return languages[current].locale;
		},

		getCurrentName: function () {
			return languages[current].name;
		},

		getLanguages: function () {
			return Object.keys(languages).map(key => {
				return {
					code: key,
					name: languages[key].name
				};
			});
		},

		getCurrent: function () {
			return current;
		},
		setCurrent: setCurrent
	};
});
