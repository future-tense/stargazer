/* global angular, console */

import 'ionic-sdk/release/js/ionic.bundle';

class ExportAccountController {

	constructor(Keychain, Wallet) {

		const stellar = {
			account: {
				network: Wallet.current.network
			}
		};

		stellar.key = Keychain.getKeyInfo(Wallet.current.id);

		this.text = JSON.stringify({
			stellar: stellar
		});
	}
}

angular.module('app.component.export-account', [])
.component('exportAccount', {
	controller: ExportAccountController,
	controllerAs: 'vm',
	templateUrl: 'app/account-settings/components/export-account.html'
});
