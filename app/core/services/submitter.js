/* global angular, console */

import 'ionic-sdk/release/js/ionic.bundle';

angular.module('app.service.submitter', [])
.factory('Submitter', function (Modal, Constellation, Transactions) {
	'use strict';

	return {
		submit:					submit,
		submitSignature:		submitSignature,
		submitSigningRequest:	submitSigningRequest,
		submitTransaction:		submitTransaction
	};

	function submit(context) {
		const data = {
			context: context
		};
		return Modal.show('app/core/modals/review-submit.html', data);
	}

	function submitSignature(context, hash) {
		const sigs = context.signatures.map(sig => sig.toXDR().toString('base64'));

		return Constellation.submitSignatures(hash, sigs)
		.then(() => {
			Transactions.markAsSigned(hash, context.id);
		});
	}

	function submitSigningRequest(context, hash) {
		context.tx.signatures.push(...context.signatures);
		const txenv = encodeTransaction(context.tx);

		return Constellation.submitTransaction(txenv, context.network)
		.then(() => {
			const data = {
				txenv: txenv,
				id: context.id,
				tx: context.tx,
				network: context.network,
				progress: context.progress
			};
			Transactions.addTransaction(hash, data);
			Transactions.markAsSigned(hash, context.id);
		});
	}

	function submitTransaction(context) {
		context.tx.signatures.push(...context.signatures);
		return context.horizon.submitTransaction(context.tx);
	}

	function encodeTransaction(tx) {
		return tx.toEnvelope()
		.toXDR()
		.toString('base64');
	}
});
