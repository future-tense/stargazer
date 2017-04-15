/* global angular */

angular.module('app')
.factory('Commands', function ($http, $ionicLoading, $location, Contacts, Keychain, Modal, Wallet) {
	'use strict';

	return {
		onQrCodeScanned: onQrCodeScanned
	};

	function onQrCodeScanned(data) {

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
	}

	function handleAccountImport(account, key) {

		var data = window.btoa(JSON.stringify({
			account: account,
			key: key
		}));
		$location.path('/side-menu/import-account/' + data);
	}

	function handleAccount(account) {

		if (!(account.id in Wallet.accounts) && !Contacts.lookup(account.id, account.network)) {
			const data = {
				id:			account.id,
				meta:		account.meta,
				meta_type:	account.meta_type
			};

			if (account.network) {
				data.network = account.network;
			}

			Modal.show('app/account/modals/add-contact.html', data);
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
				.finally(function () {
					$ionicLoading.hide();
				});
			});
		}
	}
});
