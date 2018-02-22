/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';
import StellarSdk from 'stellar-sdk';
import contacts from './contacts.js';

angular.module('app.service.reverse', [])
.factory('Reverse', function ($q, Wallet) {
	'use strict';

	const reverseFederationCache = {};

	return {
		lookup: lookup,
		lookupAndFill: lookupAndFill
	};

	function reverseFederationLookup(accountId) {

		return Wallet.current.horizon()
		.accounts()
		.accountId(accountId)
		.call()
		.then(accountInfo => {
			if (accountInfo.home_domain) {
				return StellarSdk.FederationServer.createForDomain(accountInfo.home_domain)
				.then(federationServer => {
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

		return $q((resolve, reject) => {
			if (accountId in Wallet.accounts) {
				resolve(Wallet.accounts[accountId].alias);
			}

			else {

				let name;
				if (tx) {
					name = contacts.lookup(accountId, network, tx.memoType, tx.memo);
				} else {
					name = contacts.lookup(accountId, network);
				}

				if (name) {
					resolve(name);
				}

				else if (accountId in reverseFederationCache) {
					resolve(reverseFederationCache[accountId]);
				}

				else {
					reverseFederationLookup(accountId)
					.then(name => {
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
