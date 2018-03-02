/* global angular */

import storage from './storage.js';
import translate from './translate.service.js';

const languages = {
	de: {
		name:	'Deutsch',
		locale:	'de-DE'
	},
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
	ru: {	/* russian */
		name:	'русский язык',
		locale:	'ru-RU'
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

let current = storage.getItem('language') || 'en';

function setCurrent(code) {
	current = code;
	storage.setItem('language', code);
	translate.use(code);
}

setCurrent(current);

export default {
	getLocale: () =>languages[current].locale,
	getCurrentName: () => languages[current].name,

	getLanguages: function () {
		return Object.keys(languages).map(key => {
			return {
				code: key,
				name: languages[key].name
			};
		});
	},

	getCurrent: () => current,
	setCurrent: setCurrent
};
