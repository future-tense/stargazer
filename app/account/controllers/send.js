/* global angular, console, Decimal, StellarSdk */

angular.module('app')
.controller('SendCtrl', function ($ionicModal, $location, $q, $scope, DestinationCache, Keychain, Signer, Submitter, Wallet) {
	'use strict';

	$scope.assets = [];
	$scope.send = {};

	$scope.flags = {};
	$scope.flags.hasValidDestination = false;
	$scope.flags.hasPath = false;

	$scope.onAmount = function () {
		$scope.getPaths();
	};

	$scope.onAsset = function () {
		if ($scope.send.amount) {
			$scope.getPaths();
		}
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
		$scope.send.destination = '';
		$scope.send.pathRecords = [];

		$ionicModal.fromTemplateUrl('app/default/views/select-contact.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.modal = modal;
			$scope.modal.show();
		});
	};

	$scope.getPaths = function () {
		var asset = createAsset($scope.send.asset);

		var currentAccount = Wallet.current;
		var source = currentAccount.id;

		DestinationCache.lookup($scope.send.destination)
		.then(function (destInfo) {
			$scope.flags.hasPath = false;

			var dest = destInfo.account_id.trim();
			currentAccount.horizon().paths(source, dest, asset, $scope.send.amount)
			.call()
			.then(function (res) {

				console.log(JSON.stringify(res));

				//	if we're going to createAccount we can only send XLM, so filter
				//	all paths involving any not-native currencies

				if ($scope.flags.createAccount) {
					$scope.send.pathRecords = res.records.filter(function (record) {
						return (record.source_asset_type === 'native') && (record.path.length === 0);
					});
				} else {
					$scope.send.pathRecords = res.records;
				}

				$scope.flags.hasPath = true;
				$scope.$apply();
			});
		});
	};

	$scope.getSourceAssetDescription = function (path) {
		if (path.source_asset_type !== 'native') {
			return path.source_asset_code + '.' + path.source_asset_issuer;
		} else {
			return 'XLM';
		}
	};

	$scope.getAssetDescription = function (asset) {
		if (asset.asset_type !== 'native') {
			return asset.asset_code + '.' + asset.asset_issuer;
		} else {
			return 'XLM';
		}
	};

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

			var dest = destInfo.account_id.trim();

			var record = $scope.send.pathRecords[index];
			var sendAsset = createAsset(record, 'source_');
			var destAsset = createAsset(record, 'destination_');
			var destAmount = record.destination_amount;

			var operation;

			if ($scope.flags.createAccount) {
				operation = StellarSdk.Operation.createAccount({
					destination: dest,
					startingBalance: destAmount
				});
			}

			else if (sendAsset.equals(destAsset) && (record.path.length === 0)) {
				operation = StellarSdk.Operation.payment({
					destination: dest,
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
					destination: dest,
					destAsset: destAsset,
					destAmount: destAmount,
					path: path
				});
			}

			var builder = new StellarSdk.TransactionBuilder(account).addOperation(operation);

			function createMemo(_type, _content) {
				return new StellarSdk.Memo[_type](_content);
			}

			if (destInfo.memo) {
				builder.addMemo(createMemo(destInfo.memo_type, destInfo.memo));
			}

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
				$location.path('/');
			},
			function (err) {
				console.log(err);
			}
		);

	};

	var query = $location.search();
	if (Object.keys(query).length !== 0) {
		$scope.send.destination = query.destination;
		$scope.send.amount		= query.amount;
		$scope.send.asset 		= query;
		$scope.assets.push(query);

		$scope.getPaths();
		$scope.flags.prefilled = true;
	}

	$scope.$watch('sendForm.destination.$valid', function (isValid, lastValue) {

		if ($scope.flags.prefilled) {
			$scope.flags.hasValidDestination = true;
			return;
		}

		if (isValid && $scope.send.destination) {

			var currentAccount = Wallet.current;
			DestinationCache.lookup($scope.send.destination)
			.then(function (destInfo) {

				currentAccount.horizon().accounts()
				.accountId(destInfo.account_id.trim())
				.call()
				.then(function (res) {

					var assetSortFunction = function (a, b) {
						return a.asset_code > b.asset_code;
					};

					var native = res.balances.filter(function (e) {
						return e.asset_type === 'native';
					});

					var credit_alphanum4 = res.balances.filter(function (e) {
						return e.asset_type === 'credit_alphanum4';
					});

					var credit_alphanum12 = res.balances.filter(function (e) {
						return e.asset_type === 'credit_alphanum12';
					});

					credit_alphanum4.sort(assetSortFunction);
					credit_alphanum12.sort(assetSortFunction);

					native[0].asset_code = 'XLM';
					$scope.assets = native.concat(credit_alphanum4, credit_alphanum12);
					$scope.send.asset = $scope.assets[0];
					$scope.send.minAmount = 0;

					$scope.flags.createAccount = false;
					$scope.flags.hasValidDestination = true;
					$scope.$apply();
				})
				.catch(function (err) {

					//	account is not registered in the ledger yet

					$scope.assets = [{
						asset_type: 'native',
						asset_code: 'XLM'
					}];

					$scope.send.asset = $scope.assets[0];
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
