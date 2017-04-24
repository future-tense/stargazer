/* global angular, console, Decimal, StellarSdk */

angular.module('app')
.controller('SendCtrl', function ($location, $scope, Modal, Reviewer, Wallet) {
	'use strict';

	$scope.advanced = false;
	$scope.destinationAssets = [];
	$scope.send = {};
	$scope.forms = {};
	$scope.flags = {};

	let assetCodeCollisions;
	let hasPath			= false;
	let isPathPending	= true;
	let isPreFilled		= false;

	function createAsset(json, prefix) {

		if (!prefix) {
			prefix = '';
		}

		if (json[`${prefix}asset_type`] === 'native') {
			return StellarSdk.Asset.native();
		} else {
			return new StellarSdk.Asset(
				json[`${prefix}asset_code`],
				json[`${prefix}asset_issuer`]
			);
		}
	}

	function updateCollisions(assets) {
		assetCodeCollisions = Wallet.getAssetCodeCollisions(assets);
	}

	function onDestInfo(destInfo) {

		if (isPreFilled) {
			return;
		}

		if (!destInfo) {
			hasPath = false;
			isPathPending = true;
			delete $scope.send.amount;
			return;
		}

		const currentAccount = Wallet.current;

		currentAccount.horizon().accounts()
		.accountId(destInfo.id)
		.call()

		//	destInfo.id is a registered account

		.then(res => {
			/* eslint-disable camelcase */
			if (destInfo.memo_type) {
				$scope.send.memo_type	= destInfo.memo_type;
				$scope.send.memo		= destInfo.memo;
			} else {
				$scope.send.memo_type	= null;
				$scope.send.memo		= null;
			}
			/* eslint-enable camelcase */

			const assetSortFunction = function (foo, bar) {
				return foo.asset_code > bar.asset_code;
			};

			updateCollisions(res.balances.concat(Wallet.current.balances));

			//	append any issuing assets we hold in the wallet
			const issuing = currentAccount.getAssetsFromIssuer(destInfo.id);

			const assets = res.balances.concat(issuing);
			const native = assets.filter(item => item.asset_type === 'native');
			const creditAlphanum4 = assets.filter(item => item.asset_type === 'credit_alphanum4');
			const creditAlphanum12 = assets.filter(item => item.asset_type === 'credit_alphanum12');

			creditAlphanum4.sort(assetSortFunction);
			creditAlphanum12.sort(assetSortFunction);

			/* eslint-disable camelcase */
			native[0].asset_code = 'XLM';
			/* eslint-enable camelcase */
			$scope.destinationAssets = native.concat(creditAlphanum4, creditAlphanum12);
			$scope.send.asset = $scope.destinationAssets[0];
			$scope.flags.isUnregistered = false;
		})

		//	destInfo.id is not (currently) a registered account

		.catch(() => {

			/* eslint-disable camelcase */
			const assets = [{
				asset_type: 'native',
				asset_code: 'XLM'
			}];
			/* eslint-enable camelcase */

			const issuing = currentAccount.getAssetsFromIssuer(destInfo.id);
			$scope.destinationAssets = assets.concat(issuing);

			updateCollisions(Wallet.current.balances);

			$scope.send.asset = $scope.destinationAssets[0];
			$scope.flags.isUnregistered = true;
		})

		.finally(() => {
			$scope.$apply();
		});
	}

	function getPaths() {

		isPathPending	= true;
		hasPath			= false;

		if (!$scope.send.amount) {
			return;
		}

		if ($scope.flags.isUnregistered &&
			$scope.send.asset.asset_type === 'native' &&
			$scope.send.amount < 20
		) {
			return;
		}

		const currentAccount = Wallet.current;
		const source = currentAccount.id;

		//	check if we're the issuing account for this asset
		if ($scope.send.asset.asset_type !== 'native' &&
			$scope.send.asset.asset_issuer === source
		) {
			const code = $scope.send.asset.asset_code;
			const amount = $scope.send.amount.toString();

			/* eslint-disable camelcase */
			$scope.send.pathRecords = [{
				destination_amount: amount,
				destination_asset_code: code,
				destination_asset_issuer: source,
				source_amount: amount,
				source_asset_code: code,
				source_asset_issuer: source,
				path: [],
				enabled: true
			}];
			/* eslint-enable camelcase */

			isPathPending = false;
			hasPath = true;
			$scope.$apply();

			return;
		}

		if ($scope.flags.isUnregistered &&
			$scope.send.asset.asset_type === 'native'
		) {
			const amount = $scope.send.amount.toString();

			/* eslint-disable camelcase */
			$scope.send.pathRecords = [{
				destination_amount: amount,
				destination_asset_type: 'native',
				source_amount: amount,
				source_asset_type: 'native',
				path: [],
				enabled: currentAccount.canSend(amount, 1)
			}];
			/* eslint-enable camelcase */

			isPathPending = false;
			hasPath = true;
			$scope.$apply();

			return;
		}

		const destInfo = $scope.send.destInfo;
		const asset = createAsset($scope.send.asset);
		const dest = destInfo.id;
		currentAccount.horizon().paths(source, dest, asset, $scope.send.amount)
		.call()
		.then(res => {

			if (res.records.length) {

				//
				//	filter paths... keep the cheapest path per asset,
				//	excluding paths with a zero cost
				//

				const paths = {};
				res.records.forEach(record => {
					if (record.source_amount === '0.0000000') {
						return;
					}

					const key = (record.source_asset_type === 'native') ?
						'native' : record.source_asset_issuer + record.source_asset_code;

					if (key in paths) {
						if ((paths[key].source_amount - record.source_amount) > 0) {
							paths[key] = record;
						}
					} else {
						paths[key] = record;
					}
				});

				//
				//	go through the remaining paths and disable the ones that are underfunded
				//

				currentAccount.balances.forEach(asset => {
					const key = (asset.asset_code === 'XLM') ?
						'native' : asset.asset_issuer + asset.asset_code;

					if (key in paths) {
						const amount = paths[key].source_amount;
						if (asset.asset_code === 'XLM') {
							paths[key].enabled = currentAccount.canSend(amount, 1);
						} else {
							paths[key].enabled = ((asset.balance - amount) >= 0) && currentAccount.canSend(0, 1);
						}
					}
				});

				$scope.send.pathRecords = Object.keys(paths).map(key => paths[key]);

				hasPath = ($scope.send.pathRecords.length !== 0);
			}

			isPathPending = false;
			$scope.$apply();
		});
	}

	//
	//	rendering
	//

	$scope.getAssetDescription = function (asset) {
		if (asset.asset_type !== 'native') {
			if (asset.asset_code in assetCodeCollisions) {
				return `${asset.asset_code}.${asset.asset_issuer}`;
			} else {
				return asset.asset_code;
			}
		} else {
			return 'XLM';
		}
	};

	$scope.getSourceAssetDescription = function (path) {

		/* eslint-disable camelcase */
		return $scope.getAssetDescription({
			asset_type:		path.source_asset_type,
			asset_code:		path.source_asset_code,
			asset_issuer:	path.source_asset_issuer
		});
		/* eslint-enable camelcase */
	};

	//
	//	actions
	//

	$scope.selectRecipient = function () {

		//	invalidate form records first
		$scope.send.pathRecords = [];
		$scope.send.destInfo = null;

		const data = {
			network: Wallet.current.network,
			heading: 'modal.recipient.heading'
		};

		Modal.show('app/core/modals/select-contact.html', data)
		.then(dest => {
			$scope.send.destination = dest;
		});
	};

	$scope.onAmount = function () {
		getPaths();
	};

	$scope.onAsset = function () {
		getPaths();
	};

	$scope.submit = function (index) {

		const currentAccount = Wallet.current;
		const source = currentAccount.id;

		currentAccount.horizon().loadAccount(source)
		.then(account => {
			const destInfo = $scope.send.destInfo;

			const record = $scope.send.pathRecords[index];
			const sendAsset = createAsset(record, 'source_');
			const destAsset = createAsset(record, 'destination_');
			const destAmount = record.destination_amount;

			let operation;

			if ($scope.flags.isUnregistered && (destAsset.code === 'XLM')) {
				operation = StellarSdk.Operation.createAccount({
					destination: destInfo.id,
					startingBalance: destAmount
				});
			}

			else if (sendAsset.equals(destAsset) && (record.path.length === 0)) {
				operation = StellarSdk.Operation.payment({
					destination: destInfo.id,
					asset: destAsset,
					amount: destAmount
				});
			}

			else {
				const path = record.path.map(item => {
					return new StellarSdk.Asset(item.asset_code, item.asset_issuer);
				});

				operation = StellarSdk.Operation.pathPayment({
					sendAsset: sendAsset,
					sendMax: record.source_amount,
					destination: destInfo.id,
					destAsset: destAsset,
					destAmount: destAmount,
					path: path
				});
			}

			const builder = new StellarSdk.TransactionBuilder(account).addOperation(operation);

			if ($scope.send.memo_type) {
				const memo = new StellarSdk.Memo[$scope.send.memo_type]($scope.send.memo);
				builder.addMemo(memo);
			}

			const tx = builder.build();
			return {
				tx: tx,
				network: currentAccount.network
			};
		})
		.then(Reviewer.review)
		.then(() => {
			$location.path('/');
		})
		.catch(() => {});
	};

	const query = $location.search();
	if (Object.keys(query).length !== 0) {
		$scope.send.destination = query.destination;
		$scope.send.amount		= query.amount;
		$scope.send.asset 		= query;
		$scope.destinationAssets.push(query);

		if (query.memo) {
			/* eslint-disable camelcase */
			$scope.send.memo_type = query.memo.type;
			$scope.send.memo      = query.memo.value;
			/* eslint-enable camelcase */
		}

		updateCollisions($scope.destinationAssets.concat(Wallet.current.balances));

		isPreFilled = true;

		$scope.send.destInfo = {
			id: query.destination
		};

		getPaths();
	}

	$scope.showUnregistered = function () {
		return $scope.flags.isUnregistered && $scope.send.destInfo && isPathPending;
	};

	$scope.isEmail = function (address) {
		/* eslint-disable no-useless-escape */
		return /^[\w\.\+]+@([\w]+\.)+[\w]{2,}$/.test(address);
		/* eslint-enable no-useless-escape */
	};

	$scope.showPaths = function () {
		return hasPath && !isPathPending;
	};

	$scope.showNoPaths = function () {
		return !hasPath && !isPathPending;
	};

	$scope.showRaw = function () {
		return $scope.send.destInfo && ($scope.send.destInfo.id !== $scope.send.destination);
	};

	$scope.$watch('send.destInfo', onDestInfo);
});
