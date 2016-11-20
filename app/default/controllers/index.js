/* global angular, console, StellarSdk */

angular.module('app')
.controller('IndexCtrl', function ($ionicPopup, $location, $q, $rootScope, $scope, $translate, Contacts, Horizon, Language, Modal, Wallet) {
	'use strict';

	$scope.physicalScreenWidth = ((window.innerWidth > 0) ? window.innerWidth : screen.width);

	$scope.advanced = false;

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

	$rootScope.$on('password.request', function (event, signer, cb) {

		var scope = $rootScope.$new();
		scope.data = {};

		var keyName = signer;
		if (signer in Wallet.accounts) {
			keyName = Wallet.accounts[signer].alias;
		}

		$q.all([
			$translate('popup.enter-password.heading', {name: keyName}),
			$translate('global.cancel'),
			$translate('global.ok')
		])
		.then(function (res) {
			$ionicPopup.show({
				template: '<input type="password" ng-model="data.password">',
				title: res[0],
				scope: scope,
				buttons: [
					{
						text: res[1],
						onTap: function (e) {
							cb('cancel');
						}
					},
					{
						text: '<b>' + res[2] + '</b>',
						type: 'button-positive',
						onTap: function (e) {
							if (!scope.data.password) {
								e.preventDefault();
							} else {
								cb(undefined, scope.data.password);
							}
						}
					}
				]
			});
		});
	});

});
