
export default class WalletFooterController {

	constructor(Wallet) {
		this.Wallet = Wallet;
	}

	canSend() {
		return this.Wallet.current.canSend(0, 1);
	}
}
