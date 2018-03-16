
import storage from '../../core/services/storage';

export default class AdvancedSettingsController {

	/* @ngInject */
	constructor(Reverse, Wallet) {

		this.account = Wallet.current;

		this.advanced = storage.getItem('advanced');

		if ('signers' in this.account) {
			this.hasOtherSigners = this.account.signers.length !== 1;
		} else {
			this.hasOtherSigners = false;
		}

		const inflationDest = this.account.inflationDest;
		if (inflationDest) {
			Reverse.lookupAndFill(
				res => {this.inflationDest = res;},
				inflationDest
			);
		}
	}

	isActivated() {
		return this.account.isActivated();
	}
}


