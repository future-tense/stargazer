/* global angular, console, StellarSdk */

angular.module('app')
.factory('Transactions', function (Constellation, Signer, Storage, Wallet) {
	'use strict';

	var transactionList = [];
	var transactions = {};
	var eventSource;

	transactionList = Storage.getItem('transactions') || [];
	transactionList.forEach(function (hash) {
		var data = Storage.getItem('tx.' + hash);
		data.tx = new StellarSdk.Transaction(data.txenv);
		transactions[hash] = data;
	});

	subscribe();

	return {
		addTransaction: addTransaction,
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
		} else {
			transactions[hash].progress = payload.progress;
		}

		var data = {
			txenv:		payload.txenv,
			network:	payload.network,
			progress:	payload.progress
		};

		Storage.setItem('tx.' + hash, data);
		Storage.setItem('transactions', transactionList);

	}

	function getTransaction(hash) {
		return transactions[hash];
	}

	function isPending(txHash) {
		return txHash in transactions;
	}

	function subscribe() {
		var pubkeys = Wallet.accountList.map(function (account) {
			return account.id;
		});
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

			var data = {
				txenv:		tx.txenv,
				network:	tx.network,
				progress:	tx.progress
			};
			Storage.setItem('tx.' + hash, data);
		}
	}
});
