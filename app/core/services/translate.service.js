/* global angular, MessageFormat */

import 'ionic-sdk/release/js/ionic.bundle';
import MessageFormat from 'messageformat';

import de from '../../../i18n/de.json';
import en from '../../../i18n/en.json';
import es from '../../../i18n/es.json';
import fil from '../../../i18n/fil.json';
import fr from '../../../i18n/fr.json';
import hi from '../../../i18n/hi.json';
import id from '../../../i18n/id.json';
import pl from '../../../i18n/pl.json';
import ru from '../../../i18n/ru.json';
import sv from '../../../i18n/sv.json';
import zh from '../../../i18n/zh.json';

const maps = {
	de: de,
	en: en,
	es: es,
	fil: fil,
	fr: fr,
	hi: hi,
	id: id,
	pl: pl,
	ru: ru,
	sv: sv,
	zh: zh
};

let current = 'en';

const use = (code) => {
	current = code;
};

const translate = (key) => {
	if (current !== 'en') {
		const value = maps[current][key];
		if (value) {
			return value;
		}
	}

	const value = maps.en[key];
	if (value) {
		return value;
	}

	return key;
};

const instant = (key, data, type) => {

	const value = translate(key);
	if (type === 'messageformat') {
		const mfunc = new MessageFormat(current).compile(value);
		return mfunc(data);
	}

	if (data) {
		return value.replace(/{{([^{}]*)}}/g, (match, key) => data[key]);
	}

	return value;
};

export default {
	use: use,
	instant: instant,
	translate: translate
};
