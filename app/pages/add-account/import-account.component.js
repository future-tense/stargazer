
import translate from '../../core/services/translate.service.js';
import StellarHDWallet from 'stellar-hd-wallet';

export default class ImportAccountController {

	/* @ngInject */
	constructor($ionicLoading, $location, $routeParams, Keychain, Wallet) {

		this.$ionicLoading = $ionicLoading;
		this.$location = $location;
		this.$routeParams = $routeParams;
		this.Keychain = Keychain;
		this.Wallet = Wallet;

		this.account = {};
		this.state = 1;
	}

	$onInit() {
		if (this.$routeParams.data) {
			const data = JSON.parse(window.atob(this.$routeParams.data));
			this.isEncrypted = (typeof data.key === 'object');
			this.isScanned = true;
			this.account.seed = data.key;
			this.account.network = data.account.network;
			this.onChange();

			if (!this.isEncrypted) {
				this.state = 2;
			}
		}

		const numAccounts = Object.keys(this.Wallet.accounts).length;
		this.account.alias = translate.instant('account.defaultname', {number: numAccounts + 1});
	}

	onChange() {
		const keyStore  = this.account.seed;
		this.account.id = this.Keychain.idFromKey(keyStore, this.account.password);

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

	next() {
		if (this.state === 1) {
			this.Wallet.setDefaultName(this.account)
			.then(() => {
				this.state = 2;
			});
		}
	}

	importAccount() {
		this.Wallet.importAccount(this.account.id, this.account.seed, this.account.alias, this.account.network);
		this.$location.path('/');
	}
}
