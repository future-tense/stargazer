
import horizon from '../../core/services/horizon.js';
import paymentRequestModal from './payment-request.html';

export default class ReceiveController {

	/* @ngInject */
	constructor($location, Modal, Wallet) {

		this.$location = $location;
		this.Modal = Modal;
		this.Wallet = Wallet;

		this.accountId		= Wallet.current.id;
		this.hasFederation	= (Wallet.current.federation !== undefined);
		this.qrtext			= '';
		this.showAddress();
	}

	request() {
		this.Modal.show(paymentRequestModal);
	}

	showAddress() {
		const account = {
			id: this.Wallet.current.id
		};

		if (this.Wallet.current.network !== horizon.public) {
			account.network = this.Wallet.current.network;
		}

		this.qrtext = JSON.stringify({
			stellar: {
				account: account
			}
		});
	}
}
