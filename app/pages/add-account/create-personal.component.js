
import StellarSdk from 'stellar-sdk';
import StellarHDWallet from 'stellar-hd-wallet';
import shuffle from 'shuffle-array';
import withQuery from 'with-query';

import horizon from '../../core/services/horizon.js';
import translate from '../../core/services/translate.service.js';
import selectFunderModal from './select-funder.html';

export default class CreatePersonalController {

	/* @ngInject */
	constructor($location, $ionicLoading, Modal, Reviewer, Wallet) {
		this.$location = $location;
		this.Modal = Modal;
		this.Reviewer = Reviewer;
		this.Wallet = Wallet;
		this.$loading = $ionicLoading;

		this.state = 1;

		this.account = {
			alias: getAccountName()
		};

		function getAccountName() {
			const accountNum = Wallet.accountList.filter(item => !item.isMultiSig()).length + 1;
			return translate.instant('account.defaultname', {number: accountNum});
		}
	}

	async createAccount() {

		const wallet = StellarHDWallet.fromMnemonic(this.mnemonic);
		const publicKey = wallet.getPublicKey(0);
		const secret = wallet.getSecret(0);
		const name = this.account.alias;

		const network = this.account.network;

		const storeAccount = () => {
			const account = this.Wallet.importAccount(publicKey, secret, name, network);
			if (!this.result) {
				account.mnemonic = this.mnemonic;
				account.store();
			}
			this.$location.path('/');
		};

		if (this.account.funder === 'Friendbot') {
			this.$loading.show();
			return fetch(withQuery('https://friendbot.stellar.org', {addr: publicKey}))
			.then(storeAccount)
			.catch(err => {
				console.error('ERROR!', err);
			})
			.then(() => {
				this.$loading.hide();
			});
		}

		const funder = this.Wallet.accountList.find(item => {
			return item.alias === this.account.funder && item.network === network;
		});

		if (funder) {

			funder.horizon().loadAccount(funder.id)
			.then(account => {
				const tx = new StellarSdk.TransactionBuilder(account)
				.addOperation(StellarSdk.Operation.createAccount({
					destination: publicKey,
					startingBalance: this.account.amount.toString()
				}))
				.setTimeout(0)
				.build();

				return {
					tx: tx,
					network: network
				};
			})
			.then(this.Reviewer.review)
			.then(storeAccount);
		}

		else {
			storeAccount();
		}
	}

	hasValidFunder() {
		const name = this.account.funder;
		const network = this.account.network;
		if ((name === 'Friendbot') && (horizon.getNetwork(network).name === 'Testnet')) {
			return true;
		} else {
			return this.Wallet.hasAccount(name, network);
		}
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

	skip() {
		this.createAccount();
	}

	next() {
		if (this.state === 1) {
			this.minBalance = horizon.getMinimumAccountBalance(this.account.network);
			this.state = 2;
		}

		else if (this.state === 2) {
			this.mnemonic = StellarHDWallet.generateMnemonic();
			this.words = this.mnemonic.split(' ');
			this.state = 3;
		}

		else if (this.state === 3) {
			this.result = [];
			this.shuffled = shuffle(this.words);
			this.state = 4;
		}

		else if (this.state === 4) {
			this.createAccount();
		}
	}

	selectFunder() {
		const data = {
			network: this.account.network,
			minimum: this.minBalance,
			friendbot: true
		};

		this.Modal.show(selectFunderModal, data)
		.then(res => {
			this.account.funder = res;
			this.account.amount = this.minBalance;
		});
	}
}
