/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

class DeleteAccountController {

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

angular.module('app.component.delete-account', [])
.component('deleteAccount', {
	controller: DeleteAccountController,
	controllerAs: 'vm',
	templateUrl: 'app/account-settings/components/delete-account.html'
});

