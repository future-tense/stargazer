/* global angular */

(function () {
	'use strict';

	class AdvancedSettingsController {

		constructor(Reverse, Wallet) {
			const inflationDest = Wallet.current.inflationDest;
			if (inflationDest) {
				Reverse.lookupAndFill(
					res => {this.inflationDest = res;},
					inflationDest
				);
			}
		}
	}

	angular.module('app')
	.component('advancedSettings', {
		controller: AdvancedSettingsController,
		controllerAs: 'vm',
		templateUrl: 'app/account-settings/components/advanced-settings.html'
	});
}());

