/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

import accountSignersTemplate from './account-signers.html';

class AccountSignersController {

	constructor(Wallet) {
		this.account = Wallet.current;
	}

	getSigners() {
		return this.account.signers.filter(signer => signer.weight !== 0);
	}
}

angular.module('app.component.account-signer', [])
.component('accountSigners', {
	controller: AccountSignersController,
	controllerAs: 'vm',
	template: accountSignersTemplate
});

