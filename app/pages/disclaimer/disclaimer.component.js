
import storage from '../../core/services/storage';

export default class DisclaimerController {

	/* @ngInject */
	constructor($location, Wallet) {
		this.$location = $location;

		const isInitialized = Wallet.accountList.length !== 0;
		if (isInitialized) {
			this.done = 'global.done';
		} else {
			this.done = '';
		}
	}

	accept() {
		storage.setItem('acceptedTOS', 'true');
		this.$location.path('/page/add-account');
	}
}
