/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

class AddAccountController {
	constructor(Commands, QRScanner, Wallet) {
		this.Commands = Commands;
		this.QRScanner = QRScanner;

		this.isInitialized = Wallet.accountList.length !== 0;
		this.hasCamera = QRScanner.hasCamera;

		if (this.isInitialized) {
			this.heading = 'sidemenu.account';
			this.done = 'global.done';
		} else {
			this.heading = 'Create an Account';
			this.done = '';
		}
	}

	importFromQR() {
		this.QRScanner.open()
		.then(this.Commands.onQrCodeScanned);
	}
}

angular.module('app.component.add-account', [])
.component('addAccount', {
	controller: AddAccountController,
	controllerAs: 'vm',
	templateUrl: 'app/side-menu/components/add-account.html'
});
