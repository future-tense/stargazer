
import StellarHDWallet from 'stellar-hd-wallet';

export default class ImportPhraseController {

	/* @ngInject */
	constructor($ionicLoading, $location, Keychain, Wallet) {

		this.$ionicLoading = $ionicLoading;
		this.$location = $location;
		this.Keychain = Keychain;
		this.Wallet = Wallet;

		this.state = 1;
		this.account = {
			index: 0
		};
	}

	onChange() {
		const wallet = StellarHDWallet.fromMnemonic(this.account.phrase);
		this.account.id = wallet.getPublicKey(this.account.index);

		if (this.account.id in this.Wallet.accounts) {
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

	next() {
		if (this.state === 1) {
			this.Wallet.setDefaultName(this.account)
			.then(() => {
				this.state = 2;
			});
		}
	}
}
