/* global angular, console */

import 'ionic-sdk/release/js/ionic.bundle';

class ExportAccountController {

	constructor(Keychain, Wallet) {

		const account = Wallet.current;
		const key = Keychain.getKeyInfo(account.id);

		const stellar = {
			account: {
				network: account.network
			},
			key: key
		};

		this.text = JSON.stringify({
			stellar: stellar
		});

		this.key = key;
		this.isEncrypted = Keychain.isEncrypted(account);
	}
}

angular.module('app.component.export-account', [])
.component('exportAccount', {
	controller: ExportAccountController,
	controllerAs: 'vm',
	require: {
		index: '^index'
	},
	templateUrl: 'app/account-settings/components/export-account.html'
});
