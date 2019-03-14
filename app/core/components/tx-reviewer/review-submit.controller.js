/* global console */

import translate from '../../services/translate.service';
import humanizer from './humanizer';

export default /* @ngInject */ function ($scope, Keychain, Signer, Submitter, Transactions) {

	const context = $scope.data.context;
	$scope.close = close;
	$scope.state = 'signing';
	$scope.message = '';
	$scope.signer = {};
	$scope.network = context.network;

	activate();

	async function activate() {
		if (context.hasSigned && context.hasSigned.length === context.signers.length) {
			$scope.operations = humanizer.parse(context.tx);
			$scope.state = 'signed';
		} else {
			try {
				await Signer.init(context);
				await interactiveSign(context);
				submit();
			} catch (err) {
				close();
			}
		}
	}

	function close() {
		if ($scope.state === 'submitted') {
			$scope.modalResolve();
		} else {
			$scope.closeModalService();
		}
	}

	async function interactiveSign() {

		const localSigners = context.signers.filter(Keychain.isLocalSigner);
		for (const signer of localSigners) {
			await reviewSigner(signer);
			if (Signer.isApproved(context)) {
				break;
			}
		}
		context.id = localSigners;
	}

	function hasExternalSigners(context) {
		return (context.signers.length !== context.id.length);
	}

	function reviewSigner(signer) {
		$scope.signer.id			= signer;
		$scope.signer.isEncrypted	= Keychain.isEncrypted(signer);
		$scope.operations			= humanizer.parse(context.tx, signer);

		return waitForUserReview()
		.then(signTransaction);
	}

	function signTransaction(password) {
		const signer = $scope.signer.id;
		const {txHash} = context;

		return Keychain.signTransactionHash(signer, txHash, password)
		.then(updateProgress)
		.catch(err => {});
	}

	function submit() {

		const hasNewSignatures = context.signatures.length !== 0;
		const hash = context.txHash.toString('hex');

		if (hasNewSignatures && Transactions.isPending(hash)) {

			$scope.message = 'Submitting signature(s)...';
			$scope.state = 'pending';
			return Submitter.submitSignature(context, hash)
			.then(() => {
				$scope.message = 'Signature(s) sent';
				$scope.state = 'submitted';
			})
			.catch(() => {
				$scope.message = 'Submission failed';
				$scope.state = 'failed';
			});
		}

		if (Signer.isApproved(context)) {
			$scope.message = translate.instant('transaction.submitting');
			$scope.state = 'pending';
			return Submitter.submitTransaction(context)
			.then(() => {
				$scope.message = 'Transaction sent';
				$scope.state = 'submitted';
			})
			.catch(err => {
				$scope.message = 'Transaction failed';
				$scope.state = 'failed';
				console.log(err);
			});
		}

		if (hasNewSignatures && hasExternalSigners(context)) {

			$scope.message = 'Submitting signing request...';
			$scope.state = 'pending';
			return Submitter.submitSigningRequest(context, hash)
			.then(() => {
				$scope.message = 'Request sent';
				$scope.state = 'submitted';
			})
			.catch(() => {
				$scope.message = 'Submission failed';
				$scope.state = 'failed';
			});
		}

		$scope.message = 'Cancelled';
		$scope.state = 'failed';
	}

	function updateProgress(sig) {
		Signer.addSignature(context, sig);
	}

	function waitForUserReview() {
		return new Promise((resolve, reject) => {
			$scope.sign   = (password) => resolve(password);
			$scope.cancel = () => reject();
		});
	}
}
