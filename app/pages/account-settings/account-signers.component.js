
export default class AccountSignersController {

	/* @ngInject */
	constructor(Wallet) {
		this.account = Wallet.current;
	}

	getSigners() {
		return this.account.signers.filter(signer => signer.weight !== 0);
	}
}
