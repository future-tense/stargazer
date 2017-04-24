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
		.then(res => {

			Destination.lookup(res.anchor)
			.then(destInfo => {
				addAsset({
					issuer: destInfo.id,
					code:   res.asset
				});
			})
			.catch(() => {
				Anchors.lookup(res.anchor)
				.then(assetList => assetList.forEach(addAsset));
			});
		});
	}

	function addAsset(asset) {

		const ids = $scope.anchors.map(item => item.id);
		const index = ids.indexOf(asset.issuer);

		const value = {
			/* eslint-disable camelcase */
			object: {
				asset_issuer:	asset.issuer,
				asset_code:		asset.code,
				balance:		0
			},
			state:		false,
			oldState:	false
			/* eslint-enable camelcase */
		};

		if (index === -1) {
			$scope.anchors.push({
				id:			asset.issuer,
				trustlines: [
					value
				]
			});
		} else {
			const trustlines = $scope.anchors[index].trustlines;
			trustlines.push(value);
		}
	}

	function getAnchors() {
		const anchors = {};
		Wallet.current.balances.forEach(balance => {
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

		return Object.keys(anchors).map(key => {
			return {
				id: key,
				trustlines: anchors[key]
			};
		});
	}

	function getMinHeight() {
		const headerHeight = 40;
		const numButtons = 1 + ($scope.isDirty === true);
		const buttonGroupHeight = 48 * numButtons + 8 * (numButtons - 1) + 16 + 8;
		return `${window.innerHeight - (buttonGroupHeight + headerHeight)}px`;
	}

	function getTrustlines() {
		return $scope.account.balances.filter(balance => {
			return balance.asset_type !== 'native';
		});
	}

	function hasBalance(trustline) {
		return trustline.object.balance != 0;
	}

	function onChange() {
		let pristine = true;
		$scope.anchors.forEach(anchor => {
			anchor.trustlines.forEach(trustline => {
				pristine = pristine && (trustline.state === trustline.oldState);
			});
		});

		$scope.isDirty = !pristine;
		$scope.minHeight = getMinHeight();
	}

	function createTransaction(account) {

		const builder = new StellarSdk.TransactionBuilder(account);

		function addOperation(trustline) {
			const object = trustline.object;
			const params = {
				asset: new StellarSdk.Asset(object.asset_code, object.asset_issuer)
			};

			if (trustline.state === false) {
				params.limit = '0';
			}

			builder.addOperation(StellarSdk.Operation.changeTrust(params));
		}

		$scope.anchors.forEach(anchor => {
			anchor.trustlines
			.filter(trustline => trustline.state !== trustline.oldState)
			.forEach(addOperation);
		});

		const tx = builder.build();

		return {
			tx: tx,
			network: Wallet.current.network
		};
	}

	function updateTrustlines() {

		$scope.account.horizon()
		.loadAccount($scope.account.id)
		.then(createTransaction)
		.then(Reviewer.review)
		.then($scope.account.refresh)
		.then(() => $location.path('/'));
	}
});
