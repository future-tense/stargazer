/* global angular, console */

angular.module('app')
.controller('PaymentRequestCtrl', function ($scope, Horizon, Wallet) {
	'use strict';

	$scope.model = {};
	$scope.showResult = false;

	$scope.balances = Wallet.current.balances;

	var assetCodeCollisions = Wallet.getAssetCodeCollisions($scope.balances);

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

	$scope.cancel = function () {
		$scope.closeModalService();
	};

	$scope.generateQrCode = function () {

		var payment = {
			destination:	Wallet.current.id,
			amount:			$scope.model.amount
		};

		if (Wallet.current.network !== Horizon.public) {
			payment.network = Wallet.current.network;
		}

		if ($scope.model.asset.asset_type !== 'native') {
			payment.asset = {
				code:		$scope.model.asset.asset_code,
				issuer:		$scope.model.asset.asset_issuer
			};
		}

		if ($scope.model.memo_type) {
			payment.memo = {
				type: $scope.model.memo_type,
				value: $scope.model.memo
			};
		}

		var text = {
			stellar: {
				payment: payment
			}
		};

		$scope.text = JSON.stringify(text);
		$scope.showResult = true;
	};
});
