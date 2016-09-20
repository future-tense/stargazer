/* global angular, console, StellarSdk */

angular.module('app')
.controller('CreateAccountCtrl', function ($ionicModal, $location, $scope, Signer, Submitter, Wallet) {
	'use strict';

	//	:TODO: get these from Horizon
	$scope.networks = [{
		title: 'Livenet',
		phrase: 'Public Global Stellar Network ; September 2015'
	}, {
		title: 'Testnet',
		phrase: 'Test SDF Network ; September 2015'
	}];

	var numAccounts = Object.keys(Wallet.accounts).length;
	$scope.account = {
		alias: 'Personal Account #' + (numAccounts + 1),
		amount: 20,
		network: $scope.networks[0]
	};

	$scope.wallet = Wallet;

	$scope.selectAccount = function () {
		$scope.account.funder = '';
		$ionicModal.fromTemplateUrl('app/side-menu/views/modals/select-account.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.modal = modal;
			$scope.modal.show();
		});
	};

	$scope.create = function () {

		var newAccount = Wallet.createEmptyAccount(
			$scope.account.alias,
			$scope.account.network.phrase
		);

		var accounts = {};
		Object.keys(Wallet.accounts).forEach(function (key) {
			var account = Wallet.accounts[key];
			if (account.network === newAccount.network) {
				accounts[account.alias] = account;
			}
		});

		var funderName = $scope.account.funder;
		if (funderName in accounts) {
			var funder = accounts[funderName];

			funder.horizon().loadAccount(funder.id)
			.then(function (account) {
				var tx = new StellarSdk.TransactionBuilder(account)
				.addOperation(StellarSdk.Operation.createAccount({
					destination: newAccount.id,
					startingBalance: $scope.account.amount.toString()
				}))
				.build();

				return {
					tx: tx,
					network: funder.network
				};
			})
			.then(Signer.sign)
			.then(Submitter.submit)
			.then(
				function (res) {
					$location.path('/');
				},
				function (err) {
					console.log(err);
				}
			);
		}
		else {
			$location.path('/');
		}
	};
})
.directive('validFunder', function (Wallet) {
	'use strict';

	return {
		require: 'ngModel',
		link: function(scope, element, attributes, ngModel) {
			ngModel.$validators.validFunder = function (name) {

				var network = Wallet.current.network;
				if (!name) {
					return true;
				}

				var names = {};
				Object.keys(Wallet.accounts).forEach(function (key) {
					if (Wallet.account[key].network === network) {
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
		return (account.getNativeBalance() - account.getReserve() >= 20);
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

