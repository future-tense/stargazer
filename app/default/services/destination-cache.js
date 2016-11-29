/* global angular, console, StellarSdk */

angular.module('app')
.factory('DestinationCache', function ($q, Contacts, Wallet) {
	'use strict';

	var cache = {};

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

		//	Federated Address

		if (name in cache) {
			return cache[name];
		}

		var promise = StellarSdk.FederationServer.resolve(name)
		.then(function (res) {
			return {
				id: res.account_id.trim(),
				memo: res.memo,
				memo_type: res.memo_type
			};
		});

		cache[name] = promise;
		return promise;
	}

	return {
		lookup: lookup
	};
});

