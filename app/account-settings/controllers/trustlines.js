/* global angular, console, StellarSdk */

angular.module('app')
.controller('AccountTrustlinesCtrl', function ($location, $scope, Anchors, Destination, Modal, Reviewer, Wallet) {
	'use strict';

	$scope.addAnchor		= addAnchor;
	$scope.getTrustlines	= getTrustlines;
	$scope.hasBalance		= hasBalance;
	$scope.onChange			= onChange;
	$scope.updateTrustlines	= updateTrustlines;

	$scope.account		= Wallet.current;
	$scope.minHeight	= getMinHeight();
	$scope.anchors		= getAnchors();

	function addAnchor() {
		Modal.show('app/account-settings/modals/add-trustline.html')
		.then(function (res) {

			Destination.lookup(res.anchor)
			.then(function (destInfo) {
				addAsset({
					issuer: destInfo.id,
					code:   res.asset
				});
			})
			.catch(function () {
				Anchors.lookup(res.anchor)
				.then(function (assetList){
					assetList.forEach(addAsset);
				});
			});
		});
	}

	function addAsset(asset) {

		var ids = $scope.anchors.map(function (item) {
			return item.id;
		});

		var index = ids.indexOf(asset.issuer);

		var value = {
			object: {
				asset_issuer:	asset.issuer,
				asset_code:		asset.code,
				balance:		0
			},
			state:		false,
			oldState:	false
		};

		if (index === -1) {
			$scope.anchors.push({
				id:			asset.issuer,
				trustlines: [
					value
				]
			});
		} else {
			var trustlines = $scope.anchors[index].trustlines;
			trustlines.push(value);
		}
	}

	function getAnchors() {
		var anchors = {};
		Wallet.current.balances.forEach(function (balance) {
			if (balance.asset_type === 'native') {
				return;
			}

			if (!(balance.asset_issuer in anchors)) {
				anchors[balance.asset_issuer] = [];
			}
			anchors[balance.asset_issuer].push({
				object: balance,
				state: true,
				oldState: true
			});
		});

		return Object.keys(anchors).map(function (key) {
			return {
				id: key,
				trustlines: anchors[key]
			};
		});
	}

	function getMinHeight() {
		var headerHeight = 40;
		var numButtons = 1 + ($scope.isDirty === true);
		var buttonGroupHeight = 48*numButtons + 8*(numButtons - 1) + 16 + 8;
		return window.innerHeight - (buttonGroupHeight + headerHeight) + 'px';
	}

	function getTrustlines() {
		return $scope.account.balances.filter(function (balance) {
			return balance.asset_type !== 'native';
		});
	}

	function hasBalance(trustline) {
		return trustline.object.balance != 0;
	}

	function onChange() {
		var pristine = true;
		$scope.anchors.forEach(function (anchor) {
			anchor.trustlines.forEach(function (trustline) {
				pristine = pristine && (trustline.state === trustline.oldState);
			});
		});

		$scope.isDirty = !pristine;
		$scope.minHeight = getMinHeight();
	}

	function updateTrustlines() {

		$scope.account.horizon().loadAccount($scope.account.id)
		.then(function (account) {
			var builder = new StellarSdk.TransactionBuilder(account);

			$scope.anchors.forEach(function (anchor) {
				anchor.trustlines.forEach(function (trustline) {

					//	no change
					if (trustline.state === trustline.oldState) {
						return;
					}

					var object = trustline.object;
					var params = {
						asset: new StellarSdk.Asset(object.asset_code, object.asset_issuer)
					};

					if (trustline.state === false) {
						params.limit = '0';
					}

					builder.addOperation(StellarSdk.Operation.changeTrust(params));
				});
			});

			var tx = builder.build();

			return {
				tx: tx,
				network: Wallet.current.network
			};
		})
		.then(Reviewer.review)
		.then(function () {
			$scope.account.refresh()
			.then(function () {
				$location.path('/');
			});
		});
	}
});
