/* global angular, console */


(function () {
	'use strict';

	class WalletFooterController {

		constructor(Wallet) {
			this.Wallet = Wallet;
		}

		canSend() {
			return this.Wallet.current.canSend(0, 1);
		}
	}

	angular.module('app')
	.component('walletFooter', {
		controller: WalletFooterController,
		controllerAs: 'vm',
		templateUrl: 'app/account/components/wallet-footer.html'
	});
}());
