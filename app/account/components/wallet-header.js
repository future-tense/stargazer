/* global angular */

(function () {
	'use strict';

	class WalletHeaderController {
		constructor($ionicSideMenuDelegate, $location, Wallet) {
			this.wallet = Wallet.current;
			this.$location = $location;
			this.$ionicSideMenuDelegate = $ionicSideMenuDelegate;
		}

		toggleLeftMenu() {
			this.$ionicSideMenuDelegate.toggleLeft();
		}

		openSettings() {
			this.$location.path('/account-settings');
		}
	}

	angular.module('app')
	.component('walletHeader', {
		controller: WalletHeaderController,
		controllerAs: 'vm',
		require: {
			index: '^index'
		},
		templateUrl: 'app/account/templates/wallet-header.html'
	});
}());

