
import StellarSdk from 'stellar-sdk';
import StellarHDWallet from 'stellar-hd-wallet';
import shuffle from 'shuffle-array';

import horizon from '../../core/services/horizon.js';
import translate from '../../core/services/translate.service.js';

export default class RecoveryPhraseController {

	/* @ngInject */
	constructor($location, Wallet) {
		this.$location = $location;
		this.account = Wallet.current;
		this.words = this.account.mnemonic.split(' ');
		this.mnemonic = this.account.mnemonic;
		this.state = 1;
	}

	tap1(index) {
		this.result.push(this.words[index]);
		this.words.splice(index, 1);
		this.match = this.result.join(' ') === this.mnemonic;
	}

	tap2(index) {
		this.words.push(this.result[index]);
		this.result.splice(index, 1);
	}

	next() {
		if (this.state === 1) {
			this.result = [];
			this.shuffled = shuffle(this.words);
			this.state = 2;
		}

		else if (this.state === 2) {
			delete this.account.mnemonic;
			this.account.store();
			this.$location.path('/');
		}
	}
}
