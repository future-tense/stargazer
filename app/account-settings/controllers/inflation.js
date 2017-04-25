/* global angular, console, StellarSdk */

angular.module('app')
.controller('AccountInflationCtrl', function ($q, $rootScope, $scope, Modal, Reverse, Reviewer, Wallet) {
	'use strict';

	$scope.oldName = Wallet.current.alias;
	$scope.send = {};

	const inflationDest = Wallet.current.inflationDest;
	if (inflationDest) {
		Reverse.lookupAndFill(
			res => {$scope.send.destination = res;},
			inflationDest
		);
	}

	$scope.selectRecipient = function () {
		const data = {
			network: Wallet.current.network,
			heading: 'Select Inflation Destination'
		};

		Modal.show('app/core/modals/select-contact.html', data)
		.then(dest => {
			$scope.send.destination = dest;
		});
	};

	$scope.onValidAddress = function (res) {
		$scope.send.destInfo = res;
	};

	$scope.setInflation = function () {

		const currentAccount = Wallet.current;
		const source = currentAccount.id;

		currentAccount.horizon().loadAccount(source)
		.then(account => {

			const destInfo = $scope.send.destInfo;
			const builder = new StellarSdk.TransactionBuilder(account);
			builder.addOperation(StellarSdk.Operation.setOptions({
				inflationDest: destInfo.id
			}));
			const tx = builder.build();

			return {
				tx: tx,
				network: currentAccount.network
			};
		})

		.then(Reviewer.review)
		.then(() => $rootScope.goBack());

	};
});
