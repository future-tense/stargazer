/* global angular, console, require */

angular.module('app')
.controller('ReceiveCtrl', function ($ionicLoading, $q, $scope, $timeout, Horizon, Modal, platformInfo, Wallet) {
	'use strict';

	$scope.wallet = Wallet;
	$scope.qrtext = '';

	$scope.accountId = Wallet.current.id;
	$scope.balances = Wallet.current.balances;

	$scope.getAssetDescription = function (asset) {
		if (asset.asset_type !== 'native') {
			return asset.asset_code + '.' + asset.asset_issuer;
		} else {
			return 'XLM';
		}
	};

	$scope.request = function () {
		Modal.show('app/account/views/payment-request.html', $scope);
	};

	$scope.copyToClipboard = function (text) {

		var showPopover = function () {
			$ionicLoading.show({
				template: 'Copied to clipboard'
			})
			.then(function () {
				return $timeout(700);
			})
			.then(function () {
				$ionicLoading.hide();
			});
		};

		if (platformInfo.isCordova) {
/*
			window.cordova.plugins.clipboard.copy(text);
			window.plugins.toast.showShortCenter('Copied to clipboard');
*/
		} else if (platformInfo.isNW) {
			var gui = require('nw.gui');
			gui.Clipboard.get().set(text);
			showPopover();
		}
	};

	$scope.showAddress = function () {

		var account = {
			id: Wallet.current.id
		};

		if (Wallet.current.network !== Horizon.livenet) {
			account.network = Wallet.current.network;
		}

		var text = {
			stellar: {
				account: account
			}
		};

		$scope.qrtext = JSON.stringify(text);
	};

	$scope.showAddress();
});
