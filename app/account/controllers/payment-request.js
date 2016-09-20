/* global angular, console */

angular.module('app')
.controller('PaymentRequestCtrl', function ($scope, Horizon, Wallet) {
	'use strict';

	$scope.showResult = false;

	$scope.cancel = function () {
		$scope.modal.hide();
	};

	$scope.generateQrCode = function () {

		var payment = {
			destination:	Wallet.current.id,
			amount:			$scope.send.amount
		};

		if (Wallet.current.network !== Horizon.livenet) {
			payment.network = Wallet.current.network;
		}

		if ($scope.send.asset.asset_type !== 'native') {
			payment.asset = {
				code:		$scope.send.asset.asset_code,
				issuer:		$scope.send.asset.asset_issuer
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
