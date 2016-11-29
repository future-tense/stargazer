/* global angular, console, StellarSdk */

angular.module('app')
.controller('CreateAccountCtrl', function ($location, $scope, $translate, Horizon, Modal, Signer, Submitter, Wallet) {
	'use strict';

	$scope.networks = Horizon.getNetworks();

	var numAccounts = Object.keys(Wallet.accounts).length;
	$translate('account.defaultname', {number: numAccounts + 1})
	.then(function (res) {
		$scope.account = {
			alias: res,
			amount: 20,
			network: Horizon.getNetwork(Horizon.livenet)
		};
	});

	$scope.wallet = Wallet;

	$scope.selectAccount = function () {
		$scope.account.funder = '';
		Modal.show('app/side-menu/modals/select-account.html', $scope);
	};

	$scope.create = function () {

		var network = Horizon.getHash($scope.account.network.phrase);

		var accounts = {};
		Object.keys(Wallet.accounts).forEach(function (key) {
			var account = Wallet.accounts[key];
			if (account.network === network) {
				accounts[account.alias] = account;
			}
		});

		var funderName = $scope.account.funder;
		if (funderName in accounts) {

			var newAccount	= StellarSdk.Keypair.random();
			var funder		= accounts[funderName];

			funder.horizon().loadAccount(funder.id)
			.then(function (account) {
				var tx = new StellarSdk.TransactionBuilder(account)
				.addOperation(StellarSdk.Operation.createAccount({
					destination: newAccount.accountId(),
					startingBalance: $scope.account.amount.toString()
				}))
				.build();

				return {
					tx: tx,
					network: network
				};
			})
			.then(Signer.sign)
			.then(Submitter.submit)

			.then(
				function (res) {
					Wallet.importAccount(
						newAccount.accountId(),
						newAccount.seed(),
						$scope.account.alias,
						network
					);
					$location.path('/');
				},
				function (err) {
					console.log(err);
				}
			);
		}

		else {
			Wallet.createEmptyAccount(
				$scope.account.alias,
				network
			);
			$location.path('/');
		}
	};
})
.directive('validFunder', function (Wallet) {
	'use strict';

	return {
		require: 'ngModel',
		scope: {
			network: '='
		},
		link: function(scope, element, attributes, ngModel) {
			ngModel.$validators.validFunder = function (name) {

				if (!name) {
					return true;
				}

				var names = {};
				Object.keys(Wallet.accounts).forEach(function (key) {
					if (Wallet.accounts[key].network === scope.network) {
						var accountName = Wallet.accounts[key].alias;
						names[accountName] = 1;
					}
				});

				return (name in names);
			};
		}
	};
})
.controller('SelectFundingAccountCtrl', function($scope, Wallet) {
	'use strict';

	$scope.accounts = Object.keys(Wallet.accounts)
	.filter(function (key) {
		var account = Wallet.accounts[key];
		return (account.network === $scope.account.network.phrase);
	})
	.filter(function (key) {
		var account = Wallet.accounts[key];
		return account.canSend(20, 1);
	})
	.map(function (key) {
		return Wallet.accounts[key].alias;
	});

	$scope.cancel = function () {
		$scope.modal.remove();
	};

	$scope.select = function (contact) {
		$scope.account.funder = contact;
		$scope.modal.remove();
	};
});

