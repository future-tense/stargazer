/* global angular, console, require */

angular.module('app')
.controller('ReceiveCtrl', function ($ionicLoading, $location, $q, $scope, $timeout, $translate, Horizon, Modal, platformInfo, Wallet) {
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

	$scope.hasFederation = (Wallet.current.federation !== undefined);
	$scope.setFederation = function () {
		$location.path('/account-settings/federation');
	};

	if ($scope.hasFederation) {
		$scope.federation = Wallet.current.federation + '*getstargazer.com';
	}

	$scope.request = function () {
		Modal.show('app/account/modals/payment-request.html', $scope);
	};

	$scope.copyToClipboard = function (text) {

		var showPopover = function () {
			$translate('tabs.receive.copy')
			.then(function (text) {
				return $ionicLoading.show({
					template: text
				});
			})
			.then(function () {
				return $timeout(700);
			})
			.then($ionicLoading.hide);
		};

		if (platformInfo.isCordova) {
			window.cordova.plugins.clipboard.copy(text);
			showPopover();
		}

		else if (platformInfo.isNW) {
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
