/* global angular, StellarSdk */

(function () {
	'use strict';

	class CreateSharedController {
		constructor($location, $translate, Modal, Reviewer, Signer, Wallet) {

			this.$location = $location;
			this.Modal = Modal;
			this.Reviewer = Reviewer;
			this.Signer = Signer;
			this.Wallet = Wallet;

			this.account = getAccountName();
			this.advanced = false;
			this.minHeight = getMinHeight();
			this.signers = [];
			this.minimum = 20;

			function getAccountName() {
				const accountNum = getNextSharedAccountNumber();
				return {
					alias: `Shared Account #${accountNum}`,
		//			alias: $translate.instant('account.defaultname', {number: accountNum}),
					amount: 20
				};
			}

			function getNextSharedAccountNumber() {
				return Wallet.accountList.filter(item => item.isMultiSig()).length + 1;
			}

			function getMinHeight() {
				const headerHeight = 40;
				const buttonGroupHeight = 48 + 16 + 8;
				return `${window.innerHeight - (buttonGroupHeight + headerHeight)}px`;
			}
		}

		addSigner() {
			this.signers.push({
				address: this.account.signer,
				id: this.account.destInfo.id
			});

			this.account.signer = '';
			this.account.amount += 10;
			this.minimum += 10;
		}

		createAccount() {
			const network = this.account.network;
			const accounts = {};

			Object.keys(this.accounts).forEach((key) => {
				const account = this.accounts[key];
				if (account.network === network) {
					accounts[account.alias] = account;
				}
			});

			const funderName = this.account.funder;
			if (funderName in accounts) {

				const newAccount	= StellarSdk.Keypair.random();
				const funder		= accounts[funderName];
				const newAccountId	= newAccount.publicKey();

				funder.horizon()
				.loadAccount(funder.id)
				.then((account) => {

					const builder = new StellarSdk.TransactionBuilder(account)
					.addOperation(StellarSdk.Operation.createAccount({
						destination: newAccount.publicKey(),
						startingBalance: this.account.amount.toString()
					}));

					this.signers.forEach((signer) => {
						const op = StellarSdk.Operation.setOptions({
							source: newAccountId,
							signer: {
								ed25519PublicKey: signer.id,
								weight: 1
							}
						});

						builder.addOperation(op);
					});

					const threshold = this.account.threshold;
					builder.addOperation(StellarSdk.Operation.setOptions({
						source: newAccountId,
						lowThreshold: threshold,
						medThreshold: threshold,
						highThreshold: threshold
					}));

					/*	This signs for the new account */

					const tx = builder.build();
					const hash = this.Signer.getTransactionHash(tx, network);
					const sig = newAccount.signDecorated(hash);
					tx.signatures.push(sig);

					return {
						tx: tx,
						network: network
					};
				})
				.then(this.Reviewer.review)
				.then(() => {
					this.Wallet.importAccount(
						newAccountId,
						newAccount.secret(),
						this.account.alias,
						network
					);
					this.$location.path('/');
				});
			}
		}

		onValidAddress(destInfo) {
			this.account.destInfo = destInfo;
		}

		selectAccount() {
			const data = {
				network: this.account.network,
				minimum: 20 + 10 * this.signers.length,
				numOps: 1 + this.signers.length
			};

			this.Modal.show('app/side-menu/modals/select-funder.html', data)
			.then((res) => {
				this.account.funder = res;
			});
		}

		selectSigner() {
			const data = {
				network: this.account.network,
				heading: 'Select signer'
			};

			this.Modal.show('app/core/modals/select-contact.html', data)
			.then((res) => {
				this.account.signer = res;
			});
		}
	}

	angular.module('app')
	.component('createShared', {
		controller: CreateSharedController,
		controllerAs: 'vm',
		templateUrl: 'app/side-menu/components/create-shared.html'
	});
}());
