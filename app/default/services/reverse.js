/* global angular, StellarSdk */

angular.module('app')
.factory('Reverse', function ($q, Contacts, Wallet) {
	'use strict';

	var reverseFederationCache = {};

	function reverseFederationLookup(accountId) {

		return Wallet.current.horizon().accounts()
		.accountId(accountId).call()
		.then(function (accountInfo) {
			if (accountInfo.home_domain) {
				return StellarSdk.FederationServer.createForDomain(accountInfo.home_domain)
				.then(function (federationServer) {
					return federationServer.resolveAccountId(accountId)
					.then(
						function (res) {
							return res.stellar_address;
						},
						function (err) {
							return $q.reject(err);
						}
					);
				});
			} else {
				return $q.reject();
			}
		});
	}

	function lookup(accountId, network) {

		return $q(function(resolve, reject) {
			if (accountId in Wallet.accounts) {
				resolve(Wallet.accounts[accountId].alias);
			}

			else {
				var name = Contacts.lookup(accountId, network);
				if (name) {
					resolve(name);
				}

				else if (accountId in reverseFederationCache) {
					resolve(reverseFederationCache[accountId]);
				}

				else {
					reverseFederationLookup(accountId)
					.then(
						function (name) {
							reverseFederationCache[accountId] = name;
							resolve(name);
						},
						function (err) {
							reject(err);
						}
					);
				}
			}
		});
	}

	return {
		lookup: lookup,
		lookupAndFill: function (setter, accountId, network) {
			setter(accountId);
			lookup(accountId, network)
			.then(setter);
		}
	};

});
