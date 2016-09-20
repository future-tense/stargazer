
/* global angular, console, StellarSdk */

angular.module('app')
.directive('accountName', function ($q, Contacts, Wallet) {
	'use strict';

	var reverseFederationCache = {};

	function link(scope, element, attrs) {

		function nameLookup(accountId) {

			return Wallet.current.horizon().accounts()
			.accountId(accountId).call()
			.then(function (accountInfo) {
				if (accountInfo.home_domain) {
					return StellarSdk.FederationServer.createForDomain(accountInfo.home_domain)
					.then(function (federationServer) {
						return federationServer.resolveAccountId(accountId)
						.then(function (res) {
							return res.stellar_address;
						}, function (err) {
							return $q.reject(err);
						});
					});
				} else {
					return $q.reject();
				}
			});
		}

		var accountId	= scope.id;
		var network		= scope.network;
		if (accountId in Wallet.accounts) {
			scope.name = Wallet.accounts[accountId].alias;
		}

		else {
			var name = Contacts.lookup(accountId, network);
			if (name) {
				scope.name = name;
			}

			else if (accountId in reverseFederationCache) {
				scope.name = reverseFederationCache[accountId];
			}

			else {
				scope.name = accountId;
				nameLookup(accountId)
				.then(function (name) {
					reverseFederationCache[accountId] = name;
					scope.name = name;
				});
			}
		}
	}

	return {
		restrict: 'E',
		scope: {
			id: '@',
			network: '@'
		},
		link: link,
		template: '{{name}}'
	};
});
