/* global angular, console, StellarSdk */

angular.module('app')
.controller('AccountAnchorsCtrl', function ($ionicPopup, $scope, Anchors, Signer, Submitter, Wallet) {
	'use strict';

	$scope.account = Wallet.current;

	$scope.getTrustlines = function () {
		return $scope.account.balances.filter(function (balance) {
			return balance.asset_type !== 'native';
		});
	};

	$scope.addAnchor = function () {

		$scope.data = {};
		$ionicPopup.show({
			template: '<input type="text" ng-model="data.anchor">',
			title: 'Enter domain name of Anchor',
			scope: $scope,
			buttons: [
				{ text: 'Cancel' },
				{
					text: '<b>Set</b>',
					type: 'button-positive',
					onTap: function(e) {
						if (!$scope.data.anchor) {
							e.preventDefault();
						} else {
							return $scope.data.anchor;
						}
					}
				}
			]
		})
		.then(function (domain) {
			Anchors.lookup(domain)
			.then(function (assetList){

				return $scope.account.horizon().loadAccount($scope.account.id)
				.then(function (account) {
					var builder = new StellarSdk.TransactionBuilder(account);

					assetList.forEach(function (asset) {
						builder.addOperation(StellarSdk.Operation.changeTrust({
							source: $scope.account.id,
							asset: new StellarSdk.Asset(asset.code, asset.issuer)
						}));
					});

					var tx = builder.build();

					return {
						tx: tx,
						network: Wallet.current.network
					};
				});
			})
			.then(Signer.sign)
			.then(Submitter.submit)
			.then(
				Wallet.refresh,
				function (err) {
					console.log(err);
				}
			);

		});
	};
});
