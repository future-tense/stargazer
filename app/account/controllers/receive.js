/* global angular, console, require */

angular.module('app')
.controller('ReceiveCtrl', function ($ionicLoading, $location, $q, $scope, $timeout, $translate, Horizon, Modal, platformInfo, Wallet) {
	'use strict';

	$scope.copyToClipboard	= copyToClipboard;
	$scope.request			= request;
	$scope.setFederation	= setFederation;
	$scope.showAddress		= showAddress;

	$scope.accountId		= Wallet.current.id;
	$scope.hasFederation	= (Wallet.current.federation !== undefined);
	$scope.minHeight		= getMinHeight();
	$scope.qrtext			= '';
	$scope.wallet			= Wallet;

	activate();

	function activate() {
		if ($scope.hasFederation) {
			$scope.federation = Wallet.current.federation + '*getstargazer.com';
		}
		showAddress();
	}

	function copyToClipboard(text) {

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
	}

	function getMinHeight() {
		var headerHeight = 2*40;
		var numButtons = 1 + (Wallet.current.federation === undefined);
		var buttonGroupHeight = 48*numButtons + 8*(numButtons - 1) + 24;
		return window.innerHeight - (buttonGroupHeight + headerHeight) + 'px';
	}

	function request() {
		Modal.show('app/account/modals/payment-request.html');
	}

	function setFederation() {
		$location.path('/account-settings/federation');
	}

	function showAddress() {

		var account = {
			id: Wallet.current.id
		};

		if (Wallet.current.network !== Horizon.public) {
			account.network = Wallet.current.network;
		}

		$scope.qrtext = JSON.stringify({
			stellar: {
				account: account
			}
		});
	}
});
