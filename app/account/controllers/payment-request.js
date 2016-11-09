/* global angular, console */

angular.module('app')
.controller('PaymentRequestCtrl', function ($scope, Horizon, Wallet) {
	'use strict';

	$scope.model = {};
	$scope.showResult = false;

	$scope.cancel = function () {
		$scope.closeModalService();
	};

	$scope.generateQrCode = function () {

		var payment = {
			destination:	Wallet.current.id,
			amount:			$scope.model.amount
		};

		if (Wallet.current.network !== Horizon.livenet) {
			payment.network = Wallet.current.network;
		}

		if ($scope.model.asset.asset_type !== 'native') {
			payment.asset = {
				code:		$scope.model.asset.asset_code,
				issuer:		$scope.model.asset.asset_issuer
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
