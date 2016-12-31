/* global angular */

angular.module('app')
.factory('Language', function ($translate, Storage) {
	'use strict';

	var languages = {
		en: {
			name:	'English',
			locale:	'en-US'
		},
		fil: {
			name:	'Pilipino',
			locale:	'fil-PH'
		},
		id: {
			name:	'Bahasa Indonesia',
			locale: 'id-ID'
		},
		sv: {
			name:	'Svenska',
			locale:	'sv-SE'
		}
	};

	var current = Storage.getItem('language') || 'en';

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
			return Object.keys(languages).map(function (key) {
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
