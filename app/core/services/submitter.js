/* global angular, console */

angular.module('app')
.factory('Submitter', function ($rootScope, $ionicLoading, $q, $translate, Modal, Constellation, Signer, Transactions) {
	'use strict';

	return {
		submit:					submit,
		submitSignature:		submitSignature,
		submitSigningRequest:	submitSigningRequest,
		submitTransaction:		submitTransaction
	};

	function submit(context) {
		const scope = $rootScope.$new();
		scope.context = context;
		return Modal.show('app/core/modals/review-submit.html', scope);
	}

	function submitSignature(context, hash) {
		const sigs = context.signatures.map(function (sig) {
			return sig.toXDR().toString('base64');
		});

		return Constellation.submitSignatures(hash, sigs);
	}

	function submitSigningRequest(context, hash) {
		context.tx.signatures.push(...context.signatures);
		const txenv = encodeTransaction(context.tx);

		return Constellation.submitTransaction(txenv, context.network)
		.then(function () {
			const data = {
				txenv: txenv,
				id: context.id,
				tx: context.tx,
				network: context.network,
				progress: context.progress
			};
			Transactions.addTransaction(hash, data);
		});
	}

	function submitTransaction(context) {
		context.tx.signatures.push(...context.signatures);
		return context.horizon.submitTransaction(context.tx);
	}

	function encodeTransaction(tx) {
		return tx.toEnvelope().toXDR().toString('base64');
	}
});
