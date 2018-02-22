/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';
import StellarSdk from 'stellar-sdk';
import horizon from '../../core/services/horizon.js';
import contacts from '../../core/services/contacts.js';

const range = (l, r) => new Array(r - l).fill().map((_, k) => k + l);

class CreateSharedController {

	constructor($location, Commands, Modal, QRScanner, Reviewer, Signer, Wallet) {
		this.$location = $location;
		this.Modal = Modal;
		this.QRScanner = QRScanner;
		this.Reviewer = Reviewer;
		this.Signer = Signer;
		this.Wallet = Wallet;
		this.Commands = Commands;

		this.account = {
			alias:	getAccountName()
		};

		this.signers = [];
		this.state = 0;

		this.currentSignerIndex = 1;
		this.numCosigners = 2;
		this.threshold = 1;

		this.hasCamera = this.QRScanner.hasCamera;

		function getAccountName() {
			const accountNum = getNextSharedAccountNumber();
			return `Shared Account #${accountNum}`;
		}

		function getNextSharedAccountNumber() {
			return Wallet.accountList.filter(item => item.isMultiSig()).length + 1;
		}
	}

	onCosignerCountChange() {
		this.threshold = Math.min(this.threshold, this.numCosigners);
	}

	getCosignerOptions() {
		return range(2, 11);
	}

	getThresholdOptions() {
		return range(1, this.numCosigners + 1);
	}

	hasContacts() {
		return contacts.forNetwork(this.account.network).length !== 0;
	}

	next() {
		if (this.state === 0) {
			this.state = 1;
		}

		else if (this.state === 1) {
			this.addSigner();
			if (this.signers.length === this.numCosigners) {

				const fees = horizon.getFees(this.account.network);
				this.minimum = fees.baseReserve * (2 + this.numCosigners);
				this.account.amount = this.minimum;
				this.state = 2;
			}
		}

		else if (this.state === 2) {
			this.createAccount();
		}
	}

	addSigner() {
		this.signers.push({
			address: this.account.signer,
			id: this.account.destInfo.id
		});
		this.account.signer = '';
		this.currentSignerIndex += 1;
	}

	createAccount() {
		const network = this.account.network;
		const accounts = {};

		Object.keys(this.Wallet.accounts).forEach((key) => {
			const account = this.Wallet.accounts[key];
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

				const threshold = this.threshold;
				builder.addOperation(StellarSdk.Operation.setOptions({
					source: newAccountId,
					lowThreshold: threshold,
					medThreshold: threshold,
					highThreshold: threshold,
					masterWeight: 0
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
			heading: 'Select Account'
		};

		this.Modal.show('app/core/modals/select-account.html', data)
		.then((res) => {
			this.account.signer = res;
		});
	}

	selectContact() {
		const data = {
			network: this.account.network,
			heading: 'Select Contact'
		};

		this.Modal.show('app/core/modals/select-contact.html', data)
		.then((res) => {
			this.account.signer = res;
		});
	}

	selectFromQR() {
		this.QRScanner.open()
		.then(this.Commands.onContact)
		.then((res) => {
			this.account.signer = res.id;
		});
	}

	selectFunder() {
		const data = {
			network: this.account.network,
			minimum: this.minimum,
			numOps: 2 + this.signers.length
		};

		this.Modal.show('app/side-menu/modals/select-funder.html', data)
		.then((res) => {
			this.account.funder = res;
		});
	}
}

angular.module('app.component.create-shared', [])
.component('createShared', {
	controller: CreateSharedController,
	controllerAs: 'vm',
	templateUrl: 'app/side-menu/components/create-shared.html'
});
