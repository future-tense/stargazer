/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';
import StellarSdk from 'stellar-sdk';

(function () {
	'use strict';

	class CreatePersonalController {

		constructor($location, Translate, Horizon, Modal, Reviewer, Wallet) {
			this.$location = $location;
			this.Modal = Modal;
			this.Reviewer = Reviewer;
			this.Wallet = Wallet;

			this.minBalance = Horizon.getMinimumAccountBalance(Wallet.current.network);
			this.state = 1;

			this.account = {
				alias: getAccountName(),
				amount: this.minBalance
			};

			function getAccountName() {
				const accountNum = Wallet.accountList.filter(item => !item.isMultiSig()).length + 1;
				return Translate.instant('account.defaultname', {number: accountNum});
			}
		}

		createAccount() {

			const network = this.account.network;

			if (this.hasValidFunder()) {

				const accounts = {};
				Object.keys(this.Wallet.accounts).forEach(key => {
					const account = this.Wallet.accounts[key];
					if (account.network === network) {
						accounts[account.alias] = account;
					}
				});

				const newAccount	= StellarSdk.Keypair.random();
				const funder		= accounts[this.account.funder];

				funder.horizon().loadAccount(funder.id)
				.then(account => {
					const tx = new StellarSdk.TransactionBuilder(account)
					.addOperation(StellarSdk.Operation.createAccount({
						destination: newAccount.publicKey(),
						startingBalance: this.account.amount.toString()
					}))
					.build();

					return {
						tx: tx,
						network: network
					};
				})
				.then(this.Reviewer.review)
				.then(() => {
					this.Wallet.importAccount(
						newAccount.publicKey(),
						newAccount.secret(),
						this.account.alias,
						network
					);
					this.$location.path('/');
				});
			}

			else {
				this.Wallet.createEmptyAccount(
					this.account.alias,
					network
				);
				this.$location.path('/');
			}
		}

		hasValidFunder() {
			const name = this.account.funder;
			const network = this.account.network;
			return this.Wallet.hasAccount(name, network);
		}

		next() {
			if (this.state === 1) {
				this.state = 2;
			}

			else if (this.state === 2) {
				this.createAccount();
			}
		}

		selectFunder() {
			const data = {
				network: this.account.network,
				minimum: this.minBalance
			};

			this.Modal.show('app/side-menu/modals/select-funder.html', data)
			.then(res => {
				this.account.funder = res;
			});
		}
	}

	angular.module('app.component.create-personal', [])
	.component('createPersonal', {
		controller: CreatePersonalController,
		controllerAs: 'vm',
		templateUrl: 'app/side-menu/components/create-personal.html'
	});
}());
