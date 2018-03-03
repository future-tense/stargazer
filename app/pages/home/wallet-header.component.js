
export default class WalletHeaderController {
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
