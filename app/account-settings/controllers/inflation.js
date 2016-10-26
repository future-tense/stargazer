/* global angular, console, StellarSdk */

angular.module('app')
.controller('AccountInflationCtrl', function ($ionicModal, $q, $rootScope, $scope, DestinationCache, Reverse, Signer, Submitter, Wallet) {
	'use strict';

	$scope.oldName = Wallet.current.alias;
	$scope.send = {};

	var inflationDest = Wallet.current.inflationDest;
	if (inflationDest) {
		Reverse.lookupAndFill($scope.send.destination, inflationDest);
	}

	$scope.selectRecipient = function () {

		//	invalidate form records first
		$scope.send.destination = '';

		$ionicModal.fromTemplateUrl('app/default/views/select-contact.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.modal = modal;
			$scope.modal.show();
		});
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
			var dest = destInfo.account_id.trim();

			var builder = new StellarSdk.TransactionBuilder(account);
			builder.addOperation(StellarSdk.Operation.setOptions({
				inflationDest: dest
			}));
			var tx = builder.build();

			return {
				tx: tx,
				network: currentAccount.network
			};
		})

		.then(Signer.sign)
		.then(Submitter.submit)

		.then(
			function (res) {
				$rootScope.goBack();
			},
			function (err) {
				console.log(err);
			}
		);
	};
});
