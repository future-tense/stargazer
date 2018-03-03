
export default class WalletFooterController {

	/* @ngInject */
	constructor(Wallet) {
		this.Wallet = Wallet;
	}

	canSend() {
		return this.Wallet.current.canSend(0, 1);
	}
}
