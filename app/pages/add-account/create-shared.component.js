
import StellarSdk from 'stellar-sdk';
import * as multisig from '@futuretense/stellar-multisig';

import horizon from '../../core/services/horizon';
import storage from '../../core/services/storage';
import selectFunderModal from './select-funder.html';

const range = (l, r) => new Array(r - l).fill().map((_, k) => k + l);

export default class CreateSharedController {

	/* @ngInject */
	constructor($location, Modal, Reviewer, Wallet) {
		this.$location = $location;
		this.Modal = Modal;
		this.Reviewer = Reviewer;
		this.Wallet = Wallet;

		this.account = {
			alias:	getAccountName(),
			weight: 1
		};

		this.advanced = storage.getItem('advanced');
		this.signers = [];
		this.state = 0;

		this.currentSignerIndex = 1;
		this.numCosigners = 2;
		this.threshold = 1;

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
			id: this.account.destInfo.id,
			weight: this.account.weight
		});
		this.account.signer = '';
		this.account.weight = 1;
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
				}))
				.setTimeout(0);

				this.signers.forEach((signer) => {
					const op = StellarSdk.Operation.setOptions({
						source: newAccountId,
						signer: {
							ed25519PublicKey: signer.id,
							weight: signer.weight
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
				const networkId = horizon.getNetworkId(network);
				const hash = multisig.getTransactionHashRaw(tx, networkId);
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

	isSigner(name) {
		return this.signers.map(item => item.address).includes(name);
	}

	accountFilter(account) {
		return !this.isSigner(account);
	}

	/* filter out contacts that have been added already, or has a memo set  */
	contactFilter(contact) {
		const [name, item] = contact;
		return !('memo' in item) && (!this.isSigner(name));
	}

	selectFunder() {
		const data = {
			network: this.account.network,
			minimum: this.minimum,
			numOps: 2 + this.signers.length
		};

		this.Modal.show(selectFunderModal, data)
		.then((res) => {
			this.account.funder = res;
		});
	}
}
