
export default class AddAccountController {

	/* @ngInject */
	constructor(Commands, QRScanner, Wallet) {
		this.Commands = Commands;
		this.QRScanner = QRScanner;

		this.isInitialized = Wallet.accountList.length !== 0;
		this.hasCamera = QRScanner.hasCamera;

		if (this.isInitialized) {
			this.done = 'global.done';
		} else {
			this.done = '';
		}
	}

	importFromQR() {
		this.QRScanner.open()
		.then(this.Commands.onQrCodeScanned);
	}
}
