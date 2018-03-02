/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';
import removePasswordModal from '../modals/remove-password.html';
import addPasswordModal from '../modals/add-password.html';
import accountSettingsTemplate from './account-settings.html';

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

	isActivated() {
		return this.account.isActivated();
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

			this.Modal.show(removePasswordModal, data)
			.then(password => this.removePassword(password))
			.catch(() => {
				this.flag.hasPassword = true;
			});
		}

		else {
			this.Modal.show(addPasswordModal)
			.then(password => this.setPassword(password))
			.then(() => {
				this.flag.hasPassword = false;
			});
		}
	}
}

angular.module('app.component.account-settings', [])
.component('accountSettings', {
	controller: AccountSettingsController,
	controllerAs: 'vm',
	template: accountSettingsTemplate
});
