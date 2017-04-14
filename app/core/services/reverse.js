/* global angular, StellarSdk */

angular.module('app')
.factory('Reverse', function ($q, Contacts, Wallet) {
	'use strict';

	const reverseFederationCache = {};

	return {
		lookup: lookup,
		lookupAndFill: lookupAndFill
	};

	function reverseFederationLookup(accountId) {

		return Wallet.current.horizon().accounts()
		.accountId(accountId).call()
		.then(function (accountInfo) {
			if (accountInfo.home_domain) {
				return StellarSdk.FederationServer.createForDomain(accountInfo.home_domain)
				.then(function (federationServer) {
					return federationServer.resolveAccountId(accountId)
					.then(res => res.stellar_address)
					.catch(err => $q.reject(err));
				});
			} else {
				return $q.reject();
			}
		});
	}

	function lookup(accountId, network, tx) {

		return $q(function(resolve, reject) {
			if (accountId in Wallet.accounts) {
				resolve(Wallet.accounts[accountId].alias);
			}

			else {

				let name;
				if (tx) {
					name = Contacts.lookup(accountId, network, tx.memoType, tx.memo);
				} else {
					name = Contacts.lookup(accountId, network);
				}

				if (name) {
					resolve(name);
				}

				else if (accountId in reverseFederationCache) {
					resolve(reverseFederationCache[accountId]);
				}

				else {
					reverseFederationLookup(accountId)
					.then(function (name) {
						reverseFederationCache[accountId] = name;
						resolve(name);
					})
					.catch(err => reject(err));
				}
			}
		});
	}

	function lookupAndFill(setter, accountId, network, tx) {
		setter(accountId);
		lookup(accountId, network, tx)
		.then(setter);
	}
});
