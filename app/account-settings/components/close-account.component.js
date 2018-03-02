/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';
import StellarSdk from 'stellar-sdk';

import closeAccountTemplate from './close-account.html';

class CloseAccountController {

	constructor($location, Reviewer, Wallet) {
		this.$location = $location;
		this.Reviewer = Reviewer;
		this.Wallet = Wallet;

		this.form = {};
		this.account = Wallet.current;
		this.data = {};
	}

	onValidAddress(res) {
		this.data.destInfo = res;
		this.onDestInfo(res);
	}

	onDestInfo(res) {
		if (res) {
			/* eslint-disable camelcase */
			if (res.memo_type) {
				this.data.memo_type	= res.memo_type;
				this.data.memo		= res.memo;
			} else {
				this.data.memo_type	= null;
				this.data.memo		= null;
			}
			/* eslint-ensable camelcase */
		}
	}

	filter(account) {
		return account !== this.account.alias;
	}

	closeAccount() {

		this.account.horizon()
		.loadAccount(this.account.id)
		.then((account) => {

			const builder = new StellarSdk.TransactionBuilder(account);
			builder.addOperation(StellarSdk.Operation.accountMerge({
				source: this.account.id,
				destination: this.data.destInfo.id
			}));

			const tx = builder.build();

			return {
				tx: tx,
				network: this.account.network
			};
		})
		.then(this.Reviewer.review)
		.then(() => this.$location.path('/'));
	}
}

angular.module('app.component.close-account', [])
.component('closeAccount', {
	controller: CloseAccountController,
	controllerAs: 'vm',
	template: closeAccountTemplate
});

