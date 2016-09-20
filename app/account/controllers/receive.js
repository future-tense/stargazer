/* global angular, console, require */

angular.module('app')
.controller('ReceiveCtrl', function ($ionicModal, $ionicPopup, $ionicLoading, $q, $scope, $timeout, Horizon, platformInfo, Wallet) {
	'use strict';

	$scope.wallet = Wallet;
	$scope.basic = true;
	$scope.send = {};
	$scope.qr = {};
	$scope.qr2 = {};

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

		$ionicModal.fromTemplateUrl('app/account/views/payment-request.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.modal = modal;
			$scope.modal.show();
		});
	};

	$scope.$on('modal.removed', function() {
		// Execute action
	});

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

		$scope.qr.text = JSON.stringify(text);
		$scope.basic = true;
	};

	$scope.showAddress();
});
