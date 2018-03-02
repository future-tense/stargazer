/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

import walletFooterTemplate from './wallet-footer.html';

class WalletFooterController {

	constructor(Wallet) {
		this.Wallet = Wallet;
	}

	canSend() {
		return this.Wallet.current.canSend(0, 1);
	}
}

angular.module('app.component.wallet-footer', [])
.component('walletFooter', {
	controller: WalletFooterController,
	controllerAs: 'vm',
	template: walletFooterTemplate
});
