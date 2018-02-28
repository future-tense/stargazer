/* global angular, console */

import 'ionic-sdk/release/js/ionic.bundle';
import StellarSdk from 'stellar-sdk';
import horizon from '../../core/services/horizon';

class InflationDestinationController {

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
		this.Modal.show('app/account-settings/modals/select-pool.html')
		.then((res) => {
			this.data.destination = res;
		});
	}

	setInflation() {

		const source = this.account.id;
		const destination = this.data.destInfo.id;

		this.account.horizon().loadAccount(source)
		.then(account => {

			const builder = new StellarSdk.TransactionBuilder(account);
			builder.addOperation(StellarSdk.Operation.setOptions({
				inflationDest: destination
			}));
			const tx = builder.build();

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

angular.module('app.component.inflation-destination', [])
.component('inflationDestination', {
	controller: InflationDestinationController,
	controllerAs: 'vm',
	templateUrl: 'app/account-settings/components/inflation-destination.html'
});
