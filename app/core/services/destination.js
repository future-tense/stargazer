/* global angular, console, StellarSdk */

angular.module('app')
.factory('Destination', function ($q, Contacts, Wallet) {
	'use strict';

	var nullPromise = $q.reject();

	function lookup(name) {

		//	empty name

		if (!name) {
			return nullPromise;
		}

		//	Account Name

		var map = {};
		Wallet.accountList.forEach(function (account) {
			map[account.alias] = account.id;
		});

		if (name in map) {
			return $q.resolve({
				id: map[name]
			});
		}

		//	Contact Name

		var contact = Contacts.get(name);
		if (contact) {
			return $q.resolve({
				id: contact.id,
				memo: contact.memo,
				memo_type: contact.memo_type
			});
		}

		//	Email address -- transform to emailaddress*getstargazer.com

		var isEmail = /^[\w\.\+]+@([\w]+\.)+[\w]{2,}$/.test(name);
		if (isEmail) {
			name += '*getstargazer.com';
		}

		//	Federated address or Public key
		var isFederation = /^[^\s\*,]+\*([\w]+\.)+[\w]{2,}$/.test(name);
		var isPubKey = StellarSdk.StrKey.isValidEd25519PublicKey(name);
		if (isFederation || isPubKey) {

			return StellarSdk.FederationServer.resolve(name)
			.then(function (res) {
				return {
					id: res.account_id.trim(),
					memo: res.memo,
					memo_type: res.memo_type
				};
			});
		}

		return nullPromise;
	}

	return {
		lookup: lookup
	};
});

