/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';
import StellarSdk from 'stellar-sdk';

class CloseAccountController {

	constructor($location, Commands, Modal, QRScanner, Reviewer, Wallet) {
		this.$location = $location;
		this.Commands = Commands;
		this.Modal = Modal;
		this.QRScanner = QRScanner;
		this.Reviewer = Reviewer;
		this.Wallet = Wallet;

		this.form = {};
		this.account = Wallet.current;
		this.hasCamera = this.QRScanner.hasCamera();
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

	selectAccount() {
		const data = {
			network: this.account.network,
			heading: 'modal.recipient.heading',
			filter: account => account !== this.account.alias
		};

		this.Modal.show('app/core/modals/select-account.html', data)
		.then(dest => {
			this.data.destination = dest;
		});
	}

	selectFromQR() {
		this.QRScanner.open()
		.then(this.Commands.onContact)
		.then(dest => {
			this.data.destination = dest;
		});
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
	templateUrl: 'app/account-settings/components/close-account.html'
});

