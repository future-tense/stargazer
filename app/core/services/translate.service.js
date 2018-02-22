/* global angular, MessageFormat */

import 'ionic-sdk/release/js/ionic.bundle';
import MessageFormat from 'messageformat';

(function () {
	'use strict';

	class TranslateService {

		constructor(TranslationMaps) {
			this.maps = TranslationMaps;
			this.current = 'en';
		}

		use(code) {
			this.current = code;
		}

		instant(key, data, type) {

			const value = this.translate(key);
			if (type === 'messageformat') {
				const mfunc = new MessageFormat(this.current).compile(value);
				return mfunc(data);
			}

			if (data) {
				return value.replace(/{{([^{}]*)}}/g, (match, key) => data[key]);
			}

			return value;
		}

		translate(key) {
			if (this.current !== 'en') {
				const value = this.maps[this.current][key];
				if (value) {
					return value;
				}
			}

			const value = this.maps.en[key];
			if (value) {
				return value;
			}

			return key;
		}
	}

	angular.module('app.service.translate', [])
	.service('Translate', TranslateService);
}());
