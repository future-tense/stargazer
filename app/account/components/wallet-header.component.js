/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

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

angular.module('app.component.wallet-header', [])
.component('walletHeader', {
	controller: WalletHeaderController,
	controllerAs: 'vm',
	require: {
		index: '^index'
	},
	templateUrl: 'app/account/components/wallet-header.html'
});

