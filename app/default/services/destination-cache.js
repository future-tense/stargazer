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

		var destInfo;

		//	Account Name

		var map = {};
		Object.keys(Wallet.accounts).forEach(function (key) {
			var alias = Wallet.accounts[key].alias;
			map[alias] = key;
		});

		var res;
		if (name in map) {
			return $q.resolve({
				account_id: map[name]
			});
		}

		//	Contact Name

		var contact = Contacts.get(name);
		if (contact) {
			return $q.resolve({
				account_id: contact.id
			});
		}

		//	Federated Address

		if (name in cache) {
			return cache[name];
		}

		res = StellarSdk.FederationServer.resolve(name);
		cache[name] = res;
		return res;
	}

	return {
		lookup: lookup
	};
});

