/* global angular, console, Decimal, StellarSdk */

angular.module('app')
.controller('SendCtrl', function ($location, $q, $scope, DestinationCache, Modal, Signer, Submitter, Wallet) {
	'use strict';

	$scope.advanced = false;

	var assetCodeCollisions;
	$scope.destinationAssets = [];
	$scope.send = {};

	$scope.flags = {};
	$scope.flags.hasValidDestination = false;
	$scope.flags.hasPath = false;
	$scope.flags.pathPending = true;

	$scope.onAmount = function () {
		$scope.getPaths();
	};

	$scope.onAsset = function () {
		$scope.getPaths();
	};

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

	$scope.selectRecipient = function () {

		//	invalidate form records first
		$scope.send.pathRecords = [];

		$scope.send.destination = '';
		Modal.show('app/core/modals/select-contact.html', $scope);
	};

	$scope.getPaths = function () {

		$scope.flags.pathPending = true;
		$scope.flags.hasPath = false;

		if (!$scope.send.amount) {
			return;
		}

		var currentAccount = Wallet.current;
		var source = currentAccount.id;

		//	check if we're the issuing account for this asset
		if ($scope.send.asset.asset_type !== 'native' && $scope.send.asset.asset_issuer === source) {

			var amount	= $scope.send.amount.toString();
			var code	= $scope.send.asset.asset_code;
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

			$scope.flags.pathPending = false;
			$scope.flags.hasPath = true;
			$scope.$apply();

			return;
		}

		DestinationCache.lookup($scope.send.destination)
		.then(function (destInfo) {
			var asset = createAsset($scope.send.asset);
			var dest = destInfo.id;
			currentAccount.horizon().paths(source, dest, asset, $scope.send.amount)
			.call()
			.then(function (res) {

				if (res.records.length === 0) {
					/* empty statement */;
				}

				//	if we're going to createAccount we can only send XLM, so filter
				//	all paths involving any non-native currencies

				else if ($scope.flags.createAccount) {
					$scope.send.pathRecords = res.records.filter(function (record) {
						return (record.source_asset_type === 'native') && (record.path.length === 0);
					});
					$scope.flags.hasPath = true;
				}

				else {

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
								paths[key].enabled = (asset.balance >= amount) && currentAccount.canSend(0, 1);
							}
						}
					});

					$scope.send.pathRecords = Object.keys(paths).map(function (key) {
						return paths[key];
					});

					$scope.flags.hasPath = ($scope.send.pathRecords.length !== 0);
				}

				$scope.flags.pathPending = false;
				$scope.$apply();
			});
		});
	};

	//
	//
	//

	function updateCollisions(assets) {
		assetCodeCollisions = Wallet.getAssetCodeCollisions(assets);
	}

	$scope.getSourceAssetDescription = function (path) {
		if (path.source_asset_type !== 'native') {
			if (path.source_asset_code in assetCodeCollisions) {
				return path.source_asset_code + '.' + path.source_asset_issuer;
			} else {
				return path.source_asset_code;
			}
		} else {
			return 'XLM';
		}
	};

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

	//
	//
	//

	$scope.submit = function (index) {

		var currentAccount = Wallet.current;
		var source = currentAccount.id;
		$q.all([
			currentAccount.horizon().loadAccount(source),
			DestinationCache.lookup($scope.send.destination)
		])
		.then(function (res) {
			var account = res[0];
			var destInfo = res[1];

			var record = $scope.send.pathRecords[index];
			var sendAsset = createAsset(record, 'source_');
			var destAsset = createAsset(record, 'destination_');
			var destAmount = record.destination_amount;

			var operation;

			if ($scope.flags.createAccount) {
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
					sendMax: new Decimal(record.source_amount).times(new Decimal(2.00)).toFixed(7),
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
		});
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

		$scope.getPaths();
		$scope.flags.prefilled = true;
	}

	$scope.$watch('sendForm.destination.$valid', function (isValid, lastValue) {

		if ($scope.flags.prefilled) {
			$scope.flags.hasValidDestination = true;
			updateCollisions(Wallet.current.balances);
			return;
		}

		if (isValid && $scope.send.destination) {

			var currentAccount = Wallet.current;
			DestinationCache.lookup($scope.send.destination)
			.then(function (destInfo) {

				var destinationId = destInfo.id;
				currentAccount.horizon().accounts()
				.accountId(destinationId)
				.call()
				.then(function (res) {

					$scope.send.destinationRaw = destinationId;
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
					var issuing = Wallet.current.balances.filter(function (asset) {
						if (asset.asset_type === 'native') {
							return false;
						} else {
							return (asset.asset_issuer === destinationId);
						}
					});

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
					$scope.send.minAmount = 0;

					$scope.flags.createAccount = false;
					$scope.flags.hasValidDestination = true;
					$scope.$apply();
				})
				.catch(function (err) {

					//	account is not registered in the ledger yet

					$scope.destinationAssets = [{
						asset_type: 'native',
						asset_code: 'XLM'
					}];

					$scope.send.asset = $scope.destinationAssets[0];
					$scope.send.minAmount = 20;

					$scope.flags.createAccount = true;
					$scope.flags.hasValidDestination = true;
					$scope.$apply();
				});
			});
		} else {
			$scope.flags.hasValidDestination = false;
			delete $scope.send.amount;
		}
	});
});
