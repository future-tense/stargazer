/* global angular, console */


(function () {
	'use strict';

	class AccountSignersController {

		constructor(Wallet) {
			this.account = Wallet.current;
		}

		getSigners() {
			return this.account.signers.filter(signer => signer.weight !== 0);
		}
	}

	angular.module('app')
	.component('accountSigners', {
		controller: AccountSignersController,
		controllerAs: 'vm',
		templateUrl: 'app/account-settings/components/account-signers.html'
	});
}());

