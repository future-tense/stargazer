
import StellarSdk from 'stellar-sdk';

export default class CloseAccountController {

	/* @ngInject */
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

			const tx = new StellarSdk.TransactionBuilder(account)
			.addOperation(StellarSdk.Operation.accountMerge({
				source: this.account.id,
				destination: this.data.destInfo.id
			}))
			.setTimeout(0)
			.build();

			return {
				tx: tx,
				network: this.account.network
			};
		})
		.then(this.Reviewer.review)
		.then(() => this.$location.path('/'));
	}
}
