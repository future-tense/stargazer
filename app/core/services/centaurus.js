/* global angular, CryptoJS */

import 'ionic-sdk/release/js/ionic.bundle';
import 'crypto-js';

class CentaurusService {

	decrypt(cipher, password) {
		const plainText = CryptoJS.AES.decrypt(cipher, password).toString(CryptoJS.enc.Utf8);
		return JSON.parse(plainText);
	}

	isValidPassword(cipher, password) {
		try {
			this.decrypt(cipher, password);
			return true;
		} catch (err) {
			return false;
		}
	}
}

angular.module('app.service.centaurus', [])
.service('CentaurusService', CentaurusService);




