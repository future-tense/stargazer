/* global angular, StellarSdk */

(function () {
	'use strict';

	class CreatePersonalController {
		constructor($location, $translate, Modal, Reviewer, Wallet) {

			this.$location = $location;
			this.Modal = Modal;
			this.Reviewer = Reviewer;
			this.Wallet = Wallet;

			this.account = getAccountName();
			this.advanced = false;
			this.minHeight = getMinHeight();

			function getAccountName() {
				const accountNum = Wallet.accountList.filter(item => !item.isMultiSig()).length + 1;
				return {
					alias: $translate.instant('account.defaultname', {number: accountNum}),
					amount: 20
				};
			}

			function getMinHeight() {
				const headerHeight = 40;
				const buttonGroupHeight = 48 + 16 + 8;
				return `${window.innerHeight - (buttonGroupHeight + headerHeight)}px`;
			}
		}

		createAccount() {

			const network = this.account.network;

			const accounts = {};
			Object.keys(this.Wallet.accounts).forEach(key => {
				const account = this.Wallet.accounts[key];
				if (account.network === network) {
					accounts[account.alias] = account;
				}
			});

			const funderName = this.account.funder;
			if (funderName in accounts) {
				const newAccount	= StellarSdk.Keypair.random();
				const funder		= accounts[funderName];

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

		selectAccount() {
			const data = {
				network: this.account.network,
				minimum: 20
			};

			this.Modal.show('app/side-menu/modals/select-funder.html', data)
			.then(res => {
				this.account.funder = res;
			});
		}
	}

	angular.module('app')
	.component('createPersonal', {
		controller: CreatePersonalController,
		controllerAs: 'vm',
		templateUrl: 'app/side-menu/components/create-personal.html'
	});
}());
