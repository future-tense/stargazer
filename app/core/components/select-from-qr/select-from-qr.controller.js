
export default class SelectFromQrController {

	/* @ngInject */
	constructor(Commands, QRScanner) {
		this.Commands  = Commands;
		this.QRScanner = QRScanner;
		this.hasCamera = QRScanner.hasCamera;
	}

	selectFromQR() {
		this.QRScanner.open()
		.then(this.Commands.onContact)
		.then(dest => {
			this.destination = dest.id;
		});
	}
}
