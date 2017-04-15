/* global angular, console, StellarSdk */

angular.module('app')
.controller('ReviewSubmitCtrl', function ($q, $scope, $translate, Humanizer, Keychain, Signer, Submitter, Transactions) {
	'use strict';

	$scope.close = close;
	$scope.state = 'signing';
	$scope.message = '';
	$scope.signer = {};

	const context = $scope.data.context;
	const hash = context.txHash.toString('hex');
	$scope.network = context.network;
	sign().then(submit);

	function sign() {

		const localSigners	= context.id;
		const signers		= context.signers;
		const txHash		= context.txHash;
		const progress		= context.progress;

		return localSigners.forEachThen(function (signer) {
			$scope.signer.id			= signer;
			$scope.signer.isEncrypted	= Keychain.isEncrypted(signer);

			$scope.operations = Humanizer.parse(context.tx, signer);

			const deferred = $q.defer();
			$scope.sign = function (password) {
				deferred.resolve(password);
			};
			$scope.cancel = function () {
				deferred.reject();
			};

			return deferred.promise.then(function (password) {
				return Keychain.signTransactionHash(signer, txHash, password)
				.then(function (sig) {
					context.signatures.push(sig);
					const sources = signers[signer];
					sources.forEach(function (source) {
						progress[source.account].weight += source.weight;
					});

					delete signers[signer];
				})
				.catch(function (err) {});
			});
		})
		.then(function () {
			return context;
		})
		.catch(function () {
			return context;
		});
	}

	function close() {
		if ($scope.state === 'submitted') {
			$scope.modalResolve();
		} else {
			$scope.closeModalService();
		}
	}

	function submit () {

		console.log(context);

		if (Transactions.isPending(hash) && context.signatures.length !== 0) {

			console.log(74);
			$scope.message = 'Submitting signature(s)...';
			$scope.state = 'pending';
			return Submitter.submitSignature(context, hash)
			.then(function () {
				$scope.message = 'Signature(s) sent';
				$scope.state = 'submitted';
			})
			.catch(function () {
				$scope.message = 'Submission failed';
				$scope.state = 'failed';
			});
		}

		if (Signer.hasEnoughSignatures(context.progress)) {

			console.log(90);
			$scope.message = $translate.instant('transaction.submitting');
			$scope.state = 'pending';
			return Submitter.submitTransaction(context)
			.then(function () {
				$scope.message = 'Transaction sent';
				$scope.state = 'submitted';
			})
			.catch(function (err) {
				$scope.message = 'Transaction failed';
				$scope.state = 'failed';
				console.log(err);
			});
		}

		if (Signer.hasExternalSigners(context) && context.signatures.length !== 0) {

			console.log(106);
			$scope.message = 'Submitting signing request...';
			$scope.state = 'pending';
			return Submitter.submitSigningRequest(context, hash)
			.then(function () {
				$scope.message = 'Request sent';
				$scope.state = 'submitted';
			})
			.catch(function () {
				$scope.message = 'Submission failed';
				$scope.state = 'failed';
			});
		}

		console.log(117);
		$scope.message = 'Cancelled';
		$scope.state = 'failed';
	}
});
