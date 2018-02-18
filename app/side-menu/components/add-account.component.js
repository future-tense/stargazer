/* global angular */

(function () {
	'use strict';

	class AddAccountController {
		constructor(Commands, QRScanner, Wallet) {
			this.Commands = Commands;
			this.QRScanner = QRScanner;

			this.isInitialized = Wallet.accountList.length !== 0;

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

	angular.module('app')
	.component('addAccount', {
		controller: AddAccountController,
		controllerAs: 'vm',
		templateUrl: 'app/side-menu/components/add-account.html'
	});
}());
