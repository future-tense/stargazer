import horizon from '../../services/horizon';

export default /* @ngInject */ function (Modal, Constellation, Transactions) {

	return {
		submitSignature:		submitSignature,
		submitSigningRequest:	submitSigningRequest,
		submitTransaction:		submitTransaction
	};

	function submitSignature(context, hash) {
		const sigs = context.signatures.map(sig => sig.toXDR().toString('base64'));

		return Constellation.submitSignatures(hash, sigs)
		.then(() => {
			Transactions.markAsSigned(hash, context.id);
		});
	}

	function submitSigningRequest(context, hash) {
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
		const server = horizon.getServer(context.network);
		return server.submitTransaction(context.tx);
	}

	function encodeTransaction(tx) {
		return tx.toEnvelope()
		.toXDR()
		.toString('base64');
	}
}
