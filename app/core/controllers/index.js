/* global angular, console, StellarSdk */

angular.module('app')
.controller('IndexCtrl', function ($http, $ionicBody, $ionicLoading, $ionicPopup, $location, $q, $rootScope, $scope, $translate, Contacts, Horizon, Keychain, Language, Modal, Storage, Wallet) {
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

			Modal.show('app/account/modals/add-contact.html', $scope);
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

		if (payment.memo) {
			object.memo = payment.memo;
		}

		$location.path('/account/send')
		.search(object);
	}

	function handleChallenge(challenge) {

		var id = challenge.id ? challenge.id : Wallet.current.id;

		if (Keychain.isLocalSigner(id)) {
			Keychain.signMessage(id, challenge.message)
			.then(function (sig) {

				$ionicLoading.show({
					template: 'Submitting response...'
				});

				$http.post(challenge.url, {
					id: id,
					msg: challenge.message,
					sig: sig
				})
				.then(function (res) {
					$ionicLoading.hide();
				}, function (err) {
					$ionicLoading.hide();
				});
			});
		}
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

		else if (data.stellar.challenge) {
			handleChallenge(data.stellar.challenge);
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
