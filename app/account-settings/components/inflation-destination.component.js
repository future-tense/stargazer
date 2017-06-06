/* global angular, console, StellarSdk */

(function () {
	'use strict';

	class InflationDestinationController {

		constructor($rootScope, Modal, Reverse, Reviewer, Wallet) {

			this.$rootScope = $rootScope;
			this.Modal = Modal;
			this.Reverse = Reverse;
			this.Reviewer = Reviewer;

			this.account = Wallet.current;
			this.send = {};

			this.lookupCurrent();
		}

		lookupCurrent() {
			const inflationDest = this.account.inflationDest;
			if (inflationDest) {
				this.Reverse.lookupAndFill(
					res => {this.send.destination = res;},
					inflationDest
				);
			}
		}

		onValidAddress(res) {
			this.send.destInfo = res;
		}

		selectRecipient() {
			const data = {
				network: this.account.network,
				heading: 'Select Inflation Destination'
			};

			this.Modal.show('app/core/modals/select-contact.html', data)
			.then(dest => {
				this.send.destination = dest;
			});
		}

		setInflation() {

			const source = this.account.id;
			const destination = this.send.destInfo.id;

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

	angular.module('app')
	.component('inflationDestination', {
		controller: InflationDestinationController,
		controllerAs: 'vm',
		templateUrl: 'app/account-settings/components/inflation-destination.html'
	});
}());
