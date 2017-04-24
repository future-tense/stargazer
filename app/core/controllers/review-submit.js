/* global angular, console, StellarSdk */

angular.module('app')
.controller('ReviewSubmitCtrl', function ($q, $scope, $translate, Humanizer, Keychain, Signer, Submitter, Transactions) {
	'use strict';

	const context = $scope.data.context;
	$scope.close = close;
	$scope.state = 'signing';
	$scope.message = '';
	$scope.signer = {};
	$scope.network = context.network;

	activate();

	function activate() {
		if (context.hasSigned && context.hasSigned.length === context.signers.length) {
			$scope.operations = Humanizer.parse(context.tx);
			$scope.state = 'signed';
		} else {
			$q.when(Signer.sign(context))
			.then(interactiveSign)
			.then(submit);
		}
	}

	function close() {
		if ($scope.state === 'submitted') {
			$scope.modalResolve();
		} else {
			$scope.closeModalService();
		}
	}

	function interactiveSign() {
		const localSigners = context.id;
		return localSigners.forEachThen(reviewSigner)
		.then(() => {})
		.catch(() => {});
	}

	function reviewSigner(signer) {
		$scope.signer.id			= signer;
		$scope.signer.isEncrypted	= Keychain.isEncrypted(signer);
		$scope.operations			= Humanizer.parse(context.tx, signer);

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

		const hash = context.txHash.toString('hex');

		if (Transactions.isPending(hash) && context.signatures.length !== 0) {

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

		if (Signer.hasEnoughSignatures(context.progress)) {

			$scope.message = $translate.instant('transaction.submitting');
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

		if (Signer.hasExternalSigners(context) && context.signatures.length !== 0) {

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
		const signer = $scope.signer.id;
		const {signers, signatures, progress} = context;
		signatures.push(sig);

		const sources = signers[signer];
		sources.forEach(source => {
			progress[source.account].weight += source.weight;
		});

		delete signers[signer];
	}

	function waitForUserReview() {
		const deferred = $q.defer();
		$scope.sign = password => deferred.resolve(password);
		$scope.cancel = () => deferred.reject();
		return deferred.promise;
	}
});
