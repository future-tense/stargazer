
export default class DeleteAccountController {

	/* @ngInject */
	constructor($location, Keychain, Wallet) {
		this.$location = $location;
		this.Wallet = Wallet;

		this.form = {};
		this.account = Wallet.current;
		this.isEncrypted = Keychain.isEncrypted(Wallet.current.id);
	}

	deleteAccount() {
		this.Wallet.removeAccount(this.account);
		this.$location.path('/');
	}
}
