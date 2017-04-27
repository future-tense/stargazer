/* global angular */

(function () {
	'use strict';

	class AccountSettingsController {

		constructor(Keychain, Modal, Wallet) {
			this.Keychain = Keychain;
			this.Modal = Modal;

			this.accountId = Wallet.current.id;
			this.account = Wallet.current;

			this.flag = {
				hasPassword: this.hasPassword()
			};
		}

		hasPassword() {
			return this.Keychain.isEncrypted(this.accountId);
		}

		removePassword(password) {
			this.Keychain.removePassword(this.accountId, password);
		}

		setPassword(password) {
			this.Keychain.setPassword(this.accountId, password);
		}

		togglePassword() {

			if (this.hasPassword()) {
				const data = {
					signer: this.accountId
				};

				this.Modal.show('app/account-settings/modals/remove-password.html', data)
				.then(password => this.removePassword(password))
				.catch(() => {
					this.flag.hasPassword = true;
				});
			}

			else {
				this.Modal.show('app/account-settings/modals/add-password.html')
				.then(password => this.setPassword(password))
				.then(() => {
					this.flag.hasPassword = false;
				});
			}
		}
	}

	angular.module('app')
	.component('accountSettings', {
		controller: AccountSettingsController,
		controllerAs: 'vm',
		templateUrl: 'app/account-settings/components/account-settings.html'
	});
}());
