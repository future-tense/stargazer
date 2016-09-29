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

		return this.reduce(function (promise, item) {
			return promise.then(function () {
				return callback(item);
			});
		}, Promise.resolve());
	}
});

angular.module('app')
.factory('Signer', function ($q, Horizon, Keychain, Wallet) {
	'use strict';

	var Buffer = buffer.Buffer;

	function getOperationCategory(op) {
		var category = 1;
		if (op.type === 'setOptions') {
			if (op.masterWeight || op.lowThreshold || op.medThreshold || op.highThreshold || op.signer) {
				category = 2;
			}
		} else if (op.type === 'allowTrust') {
			category = 0;
		}
		return category;
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

		var accounts = {};
		tx.operations.forEach(function (op) {
			var category = getOperationCategory(op);
			var source = getSourceAccount(op, tx);
			setAccountCategory(accounts, source, category);
		});

		return accounts;
	}

	function hasEnoughSignatures(sourceAccounts) {
		for (var key in sourceAccounts) {
			if (sourceAccounts.hasOwnProperty(key)) {
				var account = sourceAccounts[key];
				if (account.sum < account.threshold) {
					return false;
				}
			}
		}

		return true;
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

	function signatureBase(tx, network) {
		return Buffer.concat([
			new StellarSdk.Network(network).networkId(),
			StellarSdk.xdr.EnvelopeType.envelopeTypeTx().toXDR(),
			tx.tx.toXDR()
		]);
	}

	function transactionHash(tx, network) {
		var base = signatureBase(tx, network);
		return StellarSdk.hash(base);
	}

	/*
	// Signs the transaction with the given {@link Keypair}.
	// @param {...Keypair} keypairs Keypairs of signers
	// @returns {void}
	*/

	function signTransaction(tx, txHash, keys) {
		var sig = keys.signDecorated(txHash);
		tx.signatures.push(sig);
	}


	function getAccountInfo(context) {

		var accounts = context.accounts;
		var sourceAccounts = Object.keys(accounts);
		var accountInfo = sourceAccounts.map(function (source) {
			if (source in Wallet.accounts) {
				return $q.when(Wallet.accounts[source]);
			} else {
				return context.horizon.accounts().accountId(source).call();
			}
		});

		return $q.all(accountInfo)
		.then(function (info) {
			info.forEach(function (i) {
				accounts[i.id].signers		= i.signers;
				accounts[i.id].thresholds	= i.thresholds;
			});
			return context;
		});
	}

	//
	//	calculate signature threshold for each source account
	//

	function getThresholds(context) {
		var accounts = context.accounts;
		var sourceAccounts = Object.keys(accounts);

		sourceAccounts.forEach(function (source) {
			var account = accounts[source];

			var thresholds = [
				account.thresholds.low_threshold  * account.category[0],
				account.thresholds.med_threshold  * account.category[1],
				account.thresholds.high_threshold * account.category[2]
			];

			var threshold = Math.max.apply(null, thresholds);
			if (threshold === 0) {
				threshold = 1;
			}

			account.threshold = threshold;
			account.sum = 0;
			delete account.category;
			delete account.thresholds;
		});

		console.log(accounts);
		return context;
	}

	//
	//	extract signer information into its own structure
	//

	function getSigners(context) {
		var accounts = context.accounts;
		var sourceAccounts = Object.keys(accounts);

		var signers = {};
		sourceAccounts.forEach(function (source) {
			var account = accounts[source];

			account.signers.forEach(function (signer) {
				if (signer.weight !== 0) {
					var value = {
						account:	source,
						weight:		signer.weight
					};

					if (signer.public_key in signers) {
						signers[signer.public_key].push(value);
					} else {
						signers[signer.public_key] = [value];
					}
				}
			});

			delete account.signers;
		});

		console.log(signers);
		context.signers = signers;
		return context;
	}

	//
	//	iterate the list of signers and sign for the keys we control
	//

	function signLocalKeys(context) {
		var accounts = context.accounts;
		var signers = context.signers;

		var localSigners = Object.keys(signers).filter(Keychain.signsFor);
		var txHash = transactionHash(context.tx, context.network);

		return localSigners.forEachThen(function (signer) {
			return Keychain.getKey(signer)
			.then(function (key) {
				signTransaction(context.tx, txHash, key);
				var sources = signers[signer];
				sources.forEach(function (source) {
					accounts[source.account].sum += source.weight;
				});

				delete signers[signer];
			}, function (err) {
				console.log(err);
			});
		})
		.then(function () {
			console.log(context.tx);
			return context;
		});
	}

	function sign(context) {
		context.horizon  = Horizon.getServer(context.network);
		context.accounts = getSourceAccounts(context.tx);

		return $q.when(context)
		.then(getAccountInfo)
		.then(getThresholds)
		.then(getSigners)
		.then(signLocalKeys);
	}

	return {
		sign: sign,
		hasEnoughSignatures: hasEnoughSignatures,
		hasExternalSigners: function (context) {
			var signers = Object.keys(context.signers);
			var localSigners = signers.filter(Keychain.signsFor);
			return (signers.length !== localSigners.length);
		}
	};
});
