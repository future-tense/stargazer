/* global angular, console */

(function () {
	'use strict';

	class ExportAccountController {

		constructor(Horizon, Keychain, Wallet) {

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

	angular.module('app')
	.component('exportAccount', {
		controller: ExportAccountController,
		controllerAs: 'vm',
		templateUrl: 'app/account-settings/components/export-account.html'
	});
}());
