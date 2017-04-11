/* global angular, console */

angular.module('app')
.factory('Submitter', function ($rootScope, $ionicLoading, $q, $translate, Constellation, Signer, Transactions) {
	'use strict';

	return {
		submit: submit
	};

	function submit(context) {

		var hash = context.txHash.toString('hex');
		if (Transactions.isPending(hash)) {
			return submitSignature(context, hash);
		}

		else if (Signer.hasEnoughSignatures(context.progress)) {
			return submitTransaction(context);
		}

		else /*if (Signer.hasExternalSigners(context))*/ {
			return submitSigningRequest(context, hash);
		}

	//	$q.resolve();
	}

	function submitSignature(context, hash) {
		$ionicLoading.show({
			template: 'Submitting signature(s)...'
		});

		var sigs = context.signatures.map(function (sig) {
			return sig.toXDR().toString('base64');
		});

		return Constellation.submitSignatures(hash, sigs)
		.finally(function () {
			$ionicLoading.hide();
		});
	}

	function submitSigningRequest(context, hash) {
		$ionicLoading.show({
			template: 'Submitting signing request'
		});

		context.tx.signatures.push(...context.signatures);
		var txenv = encodeTransaction(context.tx);
		return Constellation.submitTransaction(txenv, context.network)
		.then(function () {

			var data = {
				txenv: txenv,
				id: context.id,
				tx: context.tx,
				progress: context.progress
			};
			Transactions.addTransaction(hash, data);
		})
		.finally(function () {
			$ionicLoading.hide();
		});
	}

	function submitTransaction(context) {
		var text = $translate.instant('transaction.submitting');
		$ionicLoading.show({
			template: text
		});

		context.tx.signatures.push(...context.signatures);
		return context.horizon.submitTransaction(context.tx)
		.then(function (res) {
			$ionicLoading.hide();
			return res;
		})
		.catch(function (err) {
			$ionicLoading.hide();

			var res = '';
			if (err.title === 'Transaction Failed') {
				res = 'error.transaction-failed';
			}
			$rootScope.$emit('$submitter.failed', res);
			return $q.reject();
		});
	}

	function encodeTransaction(tx) {
		return tx.toEnvelope().toXDR().toString('base64');
	}
});
