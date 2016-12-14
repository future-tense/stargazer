/* global angular, console, StellarSdk */

angular.module('app')
.controller('AccountInflationCtrl', function ($q, $rootScope, $scope, DestinationCache, Modal, Reverse, Signer, Submitter, Wallet) {
	'use strict';

	$scope.oldName = Wallet.current.alias;
	$scope.send = {};

	var inflationDest = Wallet.current.inflationDest;
	if (inflationDest) {
		Reverse.lookupAndFill(
			function (res) {$scope.send.destination = res;},
			inflationDest
		);
	}

	$scope.selectRecipient = function () {

		//	invalidate form records first
		$scope.send.destination = '';

		Modal.show('app/core/views/select-contact.html', $scope);
	};

	$scope.setInflation = function () {

		var currentAccount = Wallet.current;
		var source = currentAccount.id;

		$q.all([
			currentAccount.horizon().loadAccount(source),
			DestinationCache.lookup($scope.send.destination)
		])
		.then(function (res) {
			var account = res[0];
			var destInfo = res[1];

			var builder = new StellarSdk.TransactionBuilder(account);
			builder.addOperation(StellarSdk.Operation.setOptions({
				inflationDest: destInfo.id
			}));
			var tx = builder.build();

			return {
				tx: tx,
				network: currentAccount.network
			};
		})

		.then(Signer.sign)
		.then(Submitter.submit)
		.then(function () {
			$rootScope.goBack();
		});

	};
});
