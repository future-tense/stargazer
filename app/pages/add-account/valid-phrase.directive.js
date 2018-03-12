import bip39 from 'bip39';

export default function () {
	return {
		require: 'ngModel',
		link: function (scope, element, attributes, ngModel) {
			ngModel.$validators.validPhrase = function (phrase) {
				const wordlist = bip39.wordlists.english;
				return bip39.validateMnemonic(phrase, wordlist);
			};
		}
	};
}
