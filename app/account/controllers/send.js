/* global angular, console, Decimal, StellarSdk */

angular.module('app')
.controller('SendCtrl', function ($location, $scope, Modal, Signer, Submitter, Wallet) {
	'use strict';

	$scope.advanced = false;
	$scope.destinationAssets = [];
	$scope.send = {};
	$scope.forms = {};
	$scope.flags = {};

	var assetCodeCollisions;
	var hasPath			= false;
	var isPathPending	= true;
	var isPreFilled		= false;

	function createAsset(json, prefix) {

		if (!prefix) {
			prefix = '';
		}

		var asset;
		if (json[prefix + 'asset_type'] === 'native') {
			asset = StellarSdk.Asset.native();
		} else {
			asset = new StellarSdk.Asset(
				json[prefix + 'asset_code'],
				json[prefix + 'asset_issuer']
			);
		}

		return asset;
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

		var currentAccount = Wallet.current;

		currentAccount.horizon().accounts()
		.accountId(destInfo.id)
		.call()

		//	destInfo.id is a registered account

		.then(function (res) {
			if (destInfo.memo_type) {
				$scope.send.memo_type	= destInfo.memo_type;
				$scope.send.memo		= destInfo.memo;
			} else {
				$scope.send.memo_type	= null;
				$scope.send.memo		= null;
			}

			var assetSortFunction = function (a, b) {
				return a.asset_code > b.asset_code;
			};

			updateCollisions(res.balances.concat(Wallet.current.balances));

			//	append any issuing assets we hold in the wallet
			var issuing = currentAccount.getAssetsFromIssuer(destInfo.id);

			var assets = res.balances.concat(issuing);
			var native = assets.filter(function (e) {
				return e.asset_type === 'native';
			});

			var credit_alphanum4 = assets.filter(function (e) {
				return e.asset_type === 'credit_alphanum4';
			});

			var credit_alphanum12 = assets.filter(function (e) {
				return e.asset_type === 'credit_alphanum12';
			});

			credit_alphanum4.sort(assetSortFunction);
			credit_alphanum12.sort(assetSortFunction);

			native[0].asset_code = 'XLM';
			$scope.destinationAssets = native.concat(credit_alphanum4, credit_alphanum12);
			$scope.send.asset = $scope.destinationAssets[0];
			$scope.flags.isUnregistered = false;
		})

		//	destInfo.id is not (currently) a registered account

		.catch(function (err) {

			var assets = [{
				asset_type: 'native',
				asset_code: 'XLM'
			}];

			var issuing = currentAccount.getAssetsFromIssuer(destInfo.id);
			$scope.destinationAssets = assets.concat(issuing);

			updateCollisions(Wallet.current.balances);

			$scope.send.asset = $scope.destinationAssets[0];
			$scope.flags.isUnregistered = true;
		})

		.finally(function () {
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

		var amount;
		var currentAccount = Wallet.current;
		var source = currentAccount.id;

		//	check if we're the issuing account for this asset
		if ($scope.send.asset.asset_type !== 'native' &&
			$scope.send.asset.asset_issuer === source
		) {
			var code = $scope.send.asset.asset_code;
			amount = $scope.send.amount.toString();
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

			isPathPending = false;
			hasPath = true;
			$scope.$apply();

			return;
		}

		if ($scope.flags.isUnregistered &&
			$scope.send.asset.asset_type === 'native'
		) {
			amount = $scope.send.amount.toString();
			$scope.send.pathRecords = [{
				destination_amount: amount,
				destination_asset_type: 'native',
				source_amount: amount,
				source_asset_type: 'native',
				path: [],
				enabled: currentAccount.canSend(amount, 1)
			}];

			isPathPending = false;
			hasPath = true;
			$scope.$apply();

			return;
		}

		var destInfo = $scope.send.destInfo;
		var asset = createAsset($scope.send.asset);
		var dest = destInfo.id;
		currentAccount.horizon().paths(source, dest, asset, $scope.send.amount)
		.call()
		.then(function (res) {

			if (res.records.length) {

				//
				//	filter paths... keep the cheapest path per asset,
				//	excluding paths with a zero cost
				//

				var paths = {};
				res.records.forEach(function (record) {
					if (record.source_amount === '0.0000000') {
						return;
					}

					var key = (record.source_asset_type === 'native')?
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

				currentAccount.balances.forEach(function (asset) {
					var key = (asset.asset_code === 'XLM')?
						'native' : asset.asset_issuer + asset.asset_code;

					if (key in paths) {
						var amount = paths[key].source_amount;
						if (asset.asset_code === 'XLM') {
							paths[key].enabled = currentAccount.canSend(amount, 1);
						} else {
							paths[key].enabled = ((asset.balance - amount) >= 0) && currentAccount.canSend(0, 1);
						}
					}
				});

				$scope.send.pathRecords = Object.keys(paths).map(function (key) {
					return paths[key];
				});

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
				return asset.asset_code + '.' + asset.asset_issuer;
			} else {
				return asset.asset_code;
			}
		} else {
			return 'XLM';
		}
	};

	$scope.getSourceAssetDescription = function (path) {
		return $scope.getAssetDescription({
			asset_type:		path.source_asset_type,
			asset_code:		path.source_asset_code,
			asset_issuer:	path.source_asset_issuer
		});
	};

	//
	//	actions
	//

	$scope.selectRecipient = function () {

		//	invalidate form records first
		$scope.send.pathRecords = [];

		$scope.send.destination = '';
		$scope.send.destInfo = null;
		Modal.show('app/core/modals/select-contact.html', $scope);
	};

	$scope.onAmount = function () {
		getPaths();
	};

	$scope.onAsset = function () {
		getPaths();
	};

	$scope.submit = function (index) {

		var currentAccount = Wallet.current;
		var source = currentAccount.id;

		currentAccount.horizon().loadAccount(source)
		.then(function (account) {
			var destInfo = $scope.send.destInfo;

			var record = $scope.send.pathRecords[index];
			var sendAsset = createAsset(record, 'source_');
			var destAsset = createAsset(record, 'destination_');
			var destAmount = record.destination_amount;

			var operation;

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
				var path = record.path.map(function (p) {
					return new StellarSdk.Asset(p.asset_code, p.asset_issuer);
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

			var builder = new StellarSdk.TransactionBuilder(account).addOperation(operation);

			if ($scope.send.memo_type) {
				var memo = new StellarSdk.Memo[$scope.send.memo_type]($scope.send.memo);
				builder.addMemo(memo);
			}

			var tx = builder.build();
			return {
				tx: tx,
				network: currentAccount.network
			};
		})
		.then(Signer.sign)
		.then(Submitter.submit)
		.then(function () {
			$location.path('/');
		})
		.catch(function (){});
	};

	var query = $location.search();
	if (Object.keys(query).length !== 0) {
		$scope.send.destination = query.destination;
		$scope.send.amount		= query.amount;
		$scope.send.asset 		= query;
		$scope.destinationAssets.push(query);

		if (query.memo) {
			$scope.send.memo_type = query.memo.type;
			$scope.send.memo      = query.memo.value;
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
		return /^[\w\.\+]+@([\w]+\.)+[\w]{2,}$/.test(address);
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
