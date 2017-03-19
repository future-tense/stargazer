/* global angular, console, require */

angular.module('app')
.controller('ReceiveCtrl', function ($ionicLoading, $location, $q, $scope, $timeout, $translate, Horizon, Modal, platformInfo, Wallet) {
	'use strict';

	$scope.wallet = Wallet;
	$scope.qrtext = '';

	$scope.accountId = Wallet.current.id;

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
			var text = $translate.instant('tabs.receive.copy');
			return $ionicLoading.show({
				template: text,
				duration: 700
			});
		};

		if (platformInfo.isCordova) {
			window.cordova.plugins.clipboard.copy(text);
			showPopover();
		}

		else if (platformInfo.isElectron) {
			var electron = require('electron');
			electron.clipboard.writeText(text);
			showPopover();
		}
	};

	$scope.showAddress = function () {

		var account = {
			id: Wallet.current.id
		};

		if (Wallet.current.network !== Horizon.public) {
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
