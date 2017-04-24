/* global angular, console, StellarSdk */

angular.module('app')
.controller('CreateSharedAccountCtrl', function ($location, $scope, $translate, Modal, Reviewer, Signer, Wallet) {
	'use strict';

	$scope.create			= createAccount;
	$scope.selectAccount	= selectAccount;
	$scope.selectSigner		= selectSigner;
	$scope.addSigner		= addSigner;

	$scope.account		= getAccountName();
	$scope.advanced		= false;
	$scope.minHeight	= getMinHeight();
	$scope.wallet		= Wallet;
	$scope.signers		= [];
	$scope.minimum		= 20;

	function addSigner() {
		$scope.signers.push({
			address: $scope.account.signer,
			id: $scope.account.destInfo.id
		});
		$scope.account.signer = '';
		$scope.account.amount += 10;
		$scope.minimum += 10;
	}

	function createAccount() {

		const network = $scope.account.network;
		const accounts = {};

		Object.keys(Wallet.accounts).forEach((key) => {
			const account = Wallet.accounts[key];
			if (account.network === network) {
				accounts[account.alias] = account;
			}
		});

		const funderName = $scope.account.funder;
		if (funderName in accounts) {

			const newAccount	= StellarSdk.Keypair.random();
			const funder		= accounts[funderName];
			const newAccountId	= newAccount.publicKey();

			funder.horizon()
			.loadAccount(funder.id)
			.then((account) => {

				const builder = new StellarSdk.TransactionBuilder(account)
				.addOperation(StellarSdk.Operation.createAccount({
					destination: newAccount.publicKey(),
					startingBalance: $scope.account.amount.toString()
				}));

				$scope.signers.forEach((signer) => {
					const op = StellarSdk.Operation.setOptions({
						source: newAccountId,
						signer: {
							ed25519PublicKey: signer.id,
							weight: 1
						}
					});

					builder.addOperation(op);
				});

				const threshold = $scope.account.threshold;
				builder.addOperation(StellarSdk.Operation.setOptions({
					source: newAccountId,
					lowThreshold: threshold,
					medThreshold: threshold,
					highThreshold: threshold
				}));

				/*	This signs for the new account */

				const tx = builder.build();
				const hash = Signer.getTransactionHash(tx, network);
				const sig = newAccount.signDecorated(hash);
				tx.signatures.push(sig);

				return {
					tx: tx,
					network: network
				};
			})
			.then(Reviewer.review)
			.then(() => {
				Wallet.importAccount(
					newAccountId,
					newAccount.secret(),
					$scope.account.alias,
					network
				);
				$location.path('/');
			});
		}
	}

	function getAccountName() {
		const accountNum = getNextSharedAccountNumber();
		return {
			alias: `Shared Account #${accountNum}`,
//			alias: $translate.instant('account.defaultname', {number: accountNum}),
			amount: 20
		};
	}

	function getNextSharedAccountNumber() {
		return Wallet.accountList.filter(item => item.isMultiSig()).length + 1;
	}

	function getMinHeight() {
		const headerHeight = 40;
		const buttonGroupHeight = 48 + 16 + 8;
		return `${window.innerHeight - (buttonGroupHeight + headerHeight)}px`;
	}

	function selectSigner() {
		const data = {
			network: $scope.account.network,
			heading: 'Select signer'
		};

		Modal.show('app/core/modals/select-contact.html', data)
		.then((res) => {
			$scope.account.signer = res;
		});
	}

	function selectAccount() {
		const data = {
			network: $scope.account.network,
			minimum: 20 + 10 * $scope.signers.length,
			numOps: 1 + $scope.signers.length
		};

		Modal.show('app/side-menu/modals/select-account.html', data)
		.then((res) => {
			$scope.account.funder = res;
		});
	}
});
