/* global angular, StellarSdk */

angular.module('app')
.factory('Transactions', function (Constellation, Signer, Storage, Wallet) {
	'use strict';

	var transactionList = [];
	var transactions = {};
	var eventSource;

	transactionList = Storage.getItem('transactions') || [];
	transactionList.forEach(function (hash) {
		var data = Storage.getItem('tx.' + hash);
		data.tx = decodeTransaction(data.txenv);
		data.hash = hash;
		transactions[hash] = data;
	});

	subscribe();

	return {
		addTransaction: addTransaction,
		forSigner: forSigner,
		get: getTransaction,
		isPending: isPending,
		subscribe: subscribe,
		list: transactionList
	};

	//-----------------------------------------------------------------------//

	function addTransaction(hash, payload) {

		if (!(hash in transactions)) {
			transactions[hash] = payload;
			transactionList.push(hash);
			Storage.setItem('transactions', transactionList);
			payload.hash = hash;
			payload.signers = {};

			payload.id.split(',').forEach(function (id) {
				payload.signers[id] = 1;
			});
			storeTransaction(hash, payload);
		}

		else {
			var tx = transactions[hash];
			payload.id.split(',').forEach(function (id) {
				tx.signers[id] = 1;
			});
			storeTransaction(hash, tx);
		}
	}

	function forSigner(signer) {
		return transactionList
		.map(hash => transactions[hash])
		.filter(tx => signer in tx.signers);
	}

	function getTransaction(hash) {
		return transactions[hash];
	}

	function isPending(txHash) {
		return txHash in transactions;
	}

	function subscribe() {
		var pubkeys = Wallet.accountList.map(account => account.id);
		eventSource = Constellation.subscribe(pubkeys, onRequest, onProgress);
	}

	//-----------------------------------------------------------------------//

	function onRequest(payload) {
		var tx = new StellarSdk.Transaction(payload.txenv);
		var hash = Signer.getTransactionHash(tx, payload.network).toString('hex');
		payload.tx = tx;
		addTransaction(hash, payload);
	}

	function onProgress(payload) {

		var hash = payload.hash;
		var isDone = Object.keys(payload.progress).every(function (key) {
			var account = payload.progress[key];
			return (account.weight >= account.threshold);
		});

		if (isDone) {
			var index = transactionList.indexOf(hash);
			transactionList.splice(index, 1);
			Storage.setItem('transactions', transactionList);

			delete transactions[hash];
			Storage.removeItem('tx.' + hash);
		}

		else {
			var tx = transactions[hash];
			tx.progress = payload.progress;
			storeTransaction(hash, tx);
		}
	}

	function storeTransaction(hash, tx) {
		var data = {
			txenv:		tx.txenv,
			network:	tx.network,
			progress:	tx.progress
		};

		if ('signers' in tx) {
			data.signers = tx.signers;
		}

		Storage.setItem('tx.' + hash, data);
	}

	function decodeTransaction(txenv) {
		new StellarSdk.Transaction(txenv);
	}
});
