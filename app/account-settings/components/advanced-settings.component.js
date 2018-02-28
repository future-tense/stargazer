/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

class AdvancedSettingsController {

	constructor(Reverse, Wallet) {

		this.account = Wallet.current;

		if ('signers' in this.account) {
			this.hasOtherSigners = this.account.signers.length !== 1;
		} else {
			this.hasOtherSigners = false;
		}

		const inflationDest = this.account.inflationDest;
		if (inflationDest) {
			Reverse.lookupAndFill(
				res => {this.inflationDest = res;},
				inflationDest
			);
		}
	}

	isActivated() {
		return this.account.isActivated();
	}
}

angular.module('app.component.advanced-settings', [])
.component('advancedSettings', {
	controller: AdvancedSettingsController,
	controllerAs: 'vm',
	templateUrl: 'app/account-settings/components/advanced-settings.html'
});

