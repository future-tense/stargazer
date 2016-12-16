/* global angular, console, StellarSdk */

angular.module('app')
.controller('IndexCtrl', function ($ionicBody, $ionicPopup, $location, $q, $rootScope, $scope, $translate, Contacts, Horizon, Language, Modal, Storage, Wallet) {
	'use strict';

	$scope.physicalScreenWidth = ((window.innerWidth > 0) ? window.innerWidth : screen.width);

	function handleAccountImport(account, key) {

		var data = window.btoa(JSON.stringify({
			account: account,
			key: key
		}));
		$location.path('/side-menu/import-account/' + data);
	}

	function handleAccount(account) {

		if (!(account.id in Wallet.accounts) && !Contacts.lookup(account.id, account.network)) {

			$scope.model = {
				id:			account.id,
				meta:		account.meta,
				meta_type:	account.meta_type
			};

			if (account.network) {
				$scope.model.network = account.network;
			}

			Modal.show('app/account/views/add-contact.html', $scope);
		}
	}

	function handlePayment(payment) {
		var object = {
			destination:	payment.destination,
			amount:			payment.amount
		};

		if (!payment.asset) {
			object.asset_type	= 'native';
		} else {
			object.asset_code	= payment.asset.code;
			object.asset_issuer	= payment.asset.issuer;
		}

		$location.path('/account/send')
		.search(object);
	}

	$scope.onQrCodeScanned = function (data) {

		data = JSON.parse(data);
		if (!data.stellar) {
			return;
		}

		if (data.stellar.account) {
			if (data.stellar.key) {
				handleAccountImport(data.stellar.account, data.stellar.key);
			} else {
				handleAccount(data.stellar.account);
			}
		}
		else if (data.stellar.payment) {
			handlePayment(data.stellar.payment);
		}
	};

	$rootScope.$on('$submitter.failed', function (event, err) {
		$ionicPopup.alert({
			title: $translate.instant(err)
		}).then(function () {
			//	:KLUDGE: ionic 1.3.2 messes up, so we have to manually remove this
			$ionicBody.removeClass('modal-open');
		});
	});
});
