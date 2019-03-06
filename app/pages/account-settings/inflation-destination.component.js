
import StellarSdk from 'stellar-sdk';
import horizon from '../../core/services/horizon';
import selectPoolModal from './select-pool.html';

export default class InflationDestinationController {

	/* @ngInject */
	constructor($rootScope, Modal, Reverse, Reviewer, Wallet) {

		this.$rootScope = $rootScope;
		this.Modal = Modal;
		this.Reverse = Reverse;
		this.Reviewer = Reviewer;

		this.account = Wallet.current;
		this.data = {};

		this.lookupCurrent();
	}

	lookupCurrent() {
		const inflationDest = this.account.inflationDest;
		if (inflationDest) {
			this.Reverse.lookupAndFill(
				res => {
					this.data.destination = res;
				},
				inflationDest
			);
		}
	}

	isPublic() {
		return this.account.network === horizon.public;
	}

	onValidAddress(res) {
		this.data.destInfo = res;
	}

	selectPool() {
		this.Modal.show(selectPoolModal)
		.then((res) => {
			this.data.destination = res;
		});
	}

	setInflation() {

		const source = this.account.id;
		const destination = this.data.destInfo.id;

		this.account.horizon().loadAccount(source)
		.then(account => {

			const tx = new StellarSdk.TransactionBuilder(account)
			.addOperation(StellarSdk.Operation.setOptions({
				inflationDest: destination
			}))
			.setTimeout(0)
			.build();

			return {
				tx: tx,
				network: this.account.network
			};
		})

		.then(this.Reviewer.review)
		.then(() => {
			this.account.setInflationDest(destination);
			this.lookupCurrent();
			this.$rootScope.goBack();
		});
	}
}
