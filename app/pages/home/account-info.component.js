
import horizon from '../../core/services/horizon.js';

export default class AccountInfoController {

	/* @ngInject */
	constructor(Wallet) {
		this.Wallet = Wallet;
	}

	$onInit() {
		this.account = this.Wallet.current;
		const network = this.account.network;
		if (network !== horizon.public) {
			this.network = horizon.getNetwork(network).name;
		}
		this.lockClass = this.account.isLocallySecure() ? 'icon-lock' : 'icon-lock-open';
	}
}
