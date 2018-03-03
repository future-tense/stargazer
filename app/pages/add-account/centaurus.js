/* global angular, CryptoJS */

import 'crypto-js';

const decrypt = (cipher, password) => {
	const plainText = CryptoJS.AES.decrypt(cipher, password).toString(CryptoJS.enc.Utf8);
	return JSON.parse(plainText);
};

const isValidPassword = (cipher, password) => {
	try {
		decrypt(cipher, password);
		return true;
	} catch (err) {
		return false;
	}
};

export default {
	decrypt: decrypt,
	isValidPassword: isValidPassword
};
