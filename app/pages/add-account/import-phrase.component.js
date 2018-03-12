
import StellarHDWallet from 'stellar-hd-wallet';
import translate from '../../core/services/translate.service.js';

export default class ImportPhraseController {

	/* @ngInject */
	constructor($ionicLoading, $location, Keychain, Wallet) {

		this.$ionicLoading = $ionicLoading;
		this.$location = $location;
		this.Keychain = Keychain;
		this.Wallet = Wallet;

		this.account = {
			index: 0
		};

		const numAccounts = Object.keys(this.Wallet.accounts).length;
		this.account.alias = translate.instant('account.defaultname', {number: numAccounts + 1});
		this.advanced = false;
	}

	onChange() {
		const wallet = StellarHDWallet.fromMnemonic(this.account.phrase);
		this.publicKey = wallet.getPublicKey(this.account.index);

		if (this.publicKey in this.Wallet.accounts) {
			this.existing = true;
			this.$ionicLoading.show({
				template: 'Account already exists',
				duration: 700
			});
		} else {
			this.existing = false;
		}
	}

	importAccount() {
		const wallet = StellarHDWallet.fromMnemonic(this.account.phrase);
		const keys = wallet.getKeypair(this.account.index);

		const keyStore  = keys.secret();
		const accountId = keys.publicKey();

		this.Wallet.importAccount(accountId, keyStore, this.account.alias, this.account.network);
		this.$location.path('/');
	}
}
