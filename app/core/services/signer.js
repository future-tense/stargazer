/* global angular, buffer, console, Promise, StellarSdk */

/**
 * Executes a provided (promise-returning) function once per
 * array element, in sequence.
 *
 * @param callback              Function to call per element
 * @returns {Promise}           The resulting promise-chain
 */

Object.defineProperty(Array.prototype, 'forEachThen', {
	value: function (callback) {
		'use strict';

		return this.reduce(
			(promise, item) => promise.then(() => callback(item)),
			Promise.resolve()
		);
	}
});

angular.module('app')
.factory('Signer', function ($q, Horizon, Keychain, Wallet) {
	'use strict';

	const Buffer = buffer.Buffer;

	return {
		getTransactionHash:		getTransactionHash,
		hasEnoughSignatures:	hasEnoughSignatures,
		hasExternalSigners:		hasExternalSigners,
		sign:					sign
	};

	function getOperationCategory(op) {
		if (op.type === 'allowTrust') {
			return 0;
		}

		if ((op.type === 'setOptions') &&
			(op.masterWeight || op.lowThreshold || op.medThreshold || op.highThreshold || op.signer)) {
			return 2;
		}

		return 1;
	}

	function getSourceAccount(op, tx) {
		if (op.source) {
			return op.source;
		} else {
			return tx.source;
		}
	}

	function setAccountCategory(accounts, source, category) {
		if (!accounts[source]) {
			accounts[source] = {
				category: [0, 0, 0]
			};
		}
		accounts[source].category[category] = 1;
	}

	/**
	 * Returns an object with all the source accounts of a transaction,
	 * and their corresponding threshold categories
	 *
	 * @param tx
	 * @returns {{}}
	 */

	function getSourceAccounts(tx) {

		const accounts = {};
		tx.operations.forEach(op => {
			const category = getOperationCategory(op);
			const source = getSourceAccount(op, tx);
			setAccountCategory(accounts, source, category);
		});

		return accounts;
	}

	function hasEnoughSignatures(sourceAccounts) {
		for (const key in sourceAccounts) {
			if (sourceAccounts.hasOwnProperty(key)) {
				const account = sourceAccounts[key];
				if (account.weight < account.threshold) {
					return false;
				}
			}
		}

		return true;
	}

	function hasExternalSigners(context) {
		const signers = Object.keys(context.signers);
		const localSigners = signers.filter(Keychain.isLocalSigner);
		return (signers.length !== localSigners.length);
	}

	/*
	// Returns the "signature base" of this transaction, which is the value
	// that, when hashed, should be signed to create a signature that
	// validators on the Stellar Network will accept.
	//
	// It is composed of a sha-256 network prefix followed by the xdr-encoded form
	// of this transaction.
	// @returns {Buffer}
	*/

	function signatureBase(tx, phrase) {
		return Buffer.concat([
			new StellarSdk.Network(phrase).networkId(),
			StellarSdk.xdr.EnvelopeType.envelopeTypeTx().toXDR(),
			tx.tx.toXDR()
		]);
	}

	function getTransactionHash(tx, network) {
		const phrase = Horizon.getNetwork(network).phrase;
		const base = signatureBase(tx, phrase);
		return StellarSdk.hash(base);
	}

	function getAccountInfo(context) {

		const progress = context.progress;
		const sourceAccounts = Object.keys(progress);
		const accountInfo = sourceAccounts.map(source => {
			if (source in Wallet.accounts) {
				return $q.when(Wallet.accounts[source]);
			} else {
				return context.horizon.accounts()
				.accountId(source)
				.call()
				.catch(res => {
					/* eslint-disable camelcase */
					return $q.when({
						id: source,
						signers: [{
							public_key: source,
							weight: 1

						}],
						thresholds: {
							low_threshold:	0,
							med_threshold:	0,
							high_threshold:	0
						}
					});
					/* eslint-enable camelcase */
				});
			}
		});

		return $q.all(accountInfo)
		.then(accounts => {
			accounts.forEach(account => {
				progress[account.id].signers	= account.signers;
				progress[account.id].thresholds	= account.thresholds;
			});
			return context;
		});
	}

	//
	//	calculate signature threshold for each source account
	//

	function getThresholds(context) {
		const progress = context.progress;
		const sourceAccounts = Object.keys(progress);

		sourceAccounts.forEach(source => {
			const account = progress[source];

			const thresholds = [
				account.thresholds.low_threshold  * account.category[0],
				account.thresholds.med_threshold  * account.category[1],
				account.thresholds.high_threshold * account.category[2]
			];

			let threshold = Math.max.apply(null, thresholds);
			if (threshold === 0) {
				threshold = 1;
			}

			account.threshold = threshold;
			account.weight = 0;
			delete account.category;
			delete account.thresholds;
		});

		return context;
	}

	//
	//	extract signer information into its own structure
	//

	function getSigners(context) {
		const progress = context.progress;
		const sourceAccounts = Object.keys(progress);

		const signers = {};
		sourceAccounts.forEach(source => {

			function addSourceAccount(key, value) {
				if (key in signers) {
					signers[key].push(value);
				} else {
					signers[key] = [value];
				}
			}

			const account = progress[source];
			account.signers.forEach(signer => {
				if (signer.weight !== 0) {
					addSourceAccount(signer.public_key, {
						account:	source,
						weight:		signer.weight
					});
				}
			});

			delete account.signers;
		});

		context.signers = signers;
		return context;
	}

	//
	//	iterate the list of signers and sign for the keys we control
	//

	function signLocalKeys(context) {

		const progress = context.progress;
		const signers = context.signers;

		const signerFromHint = {};
		Object.keys(signers).forEach(key => {
			const hint = StellarSdk.Keypair.fromPublicKey(key)
			.signatureHint()
			.toString('hex');
			signerFromHint[hint] = key;
		});

		//	add weights for existing signatures

		context.tx.signatures.forEach(sig => {
			const hint = sig.hint().toString('hex');
			const signer = signerFromHint[hint];
			const sources = signers[signer];
			sources.forEach(source => {
				progress[source.account].weight += source.weight;
			});

			delete signers[signer];
		});

		context.id			= Object.keys(signers).filter(Keychain.isLocalSigner);
		context.txHash		= getTransactionHash(context.tx, context.network);
		context.signatures	= [];
		return context;
	}

	function sign(context) {
		context.horizon  = Horizon.getServer(context.network);
		context.progress = getSourceAccounts(context.tx);

		return $q.when(context)
		.then(getAccountInfo)
		.then(getThresholds)
		.then(getSigners)
		.then(signLocalKeys);
	}
});
