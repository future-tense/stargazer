/* global angular, console, StellarSdk */

angular.module('app')
.controller('CreatePersonalAccountCtrl', function ($location, $scope, $translate, Modal, Reviewer, Wallet) {
	'use strict';

	$scope.create			= createAccount;
	$scope.selectAccount	= selectAccount;

	$scope.account		= getAccountName();
	$scope.advanced		= false;
	$scope.minHeight	= getMinHeight();
	$scope.wallet		= Wallet;

	function createAccount() {

		const network = $scope.account.network;

		const accounts = {};
		Object.keys(Wallet.accounts).forEach(key => {
			const account = Wallet.accounts[key];
			if (account.network === network) {
				accounts[account.alias] = account;
			}
		});

		const funderName = $scope.account.funder;
		if (funderName in accounts) {

			const newAccount	= StellarSdk.Keypair.random();
			const funder		= accounts[funderName];

			funder.horizon().loadAccount(funder.id)
			.then(account => {
				const tx = new StellarSdk.TransactionBuilder(account)
				.addOperation(StellarSdk.Operation.createAccount({
					destination: newAccount.publicKey(),
					startingBalance: $scope.account.amount.toString()
				}))
				.build();

				return {
					tx: tx,
					network: network
				};
			})
			.then(Reviewer.review)
			.then(() => {
				Wallet.importAccount(
					newAccount.publicKey(),
					newAccount.secret(),
					$scope.account.alias,
					network
				);
				$location.path('/');
			});
		}

		else {
			Wallet.createEmptyAccount(
				$scope.account.alias,
				network
			);
			$location.path('/');
		}
	}

	function getAccountName() {
		const accountNum = Wallet.accountList.filter(item => !item.isMultiSig()).length + 1;
		return {
			alias: $translate.instant('account.defaultname', {number: accountNum}),
			amount: 20
		};
	}

	function getMinHeight() {
		const headerHeight = 40;
		const buttonGroupHeight = 48 + 16 + 8;
		return `${window.innerHeight - (buttonGroupHeight + headerHeight)}px`;
	}

	function selectAccount() {
		const data = {
			network: $scope.account.network,
			minimum: 20
		};

		Modal.show('app/side-menu/modals/select-account.html', data)
		.then(res => {
			$scope.account.funder = res;
		});
	}
});
