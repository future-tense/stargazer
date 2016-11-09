/* global angular, StellarSdk */

angular.module('app')
.factory('Horizon', function () {
	'use strict';

	var livenet = 'Public Global Stellar Network ; September 2015';
	var testnet = 'Test SDF Network ; September 2015';

	var networks = {};
	networks[livenet] = 'https://horizon.stellar.org';
	networks[testnet] = 'https://horizon-testnet.stellar.org';

	return {
		livenet: livenet,
		testnet: testnet,

		getNetworks: function () {
			return Object.keys(networks).map(function (key) {
				return {
					name: key,
					url: networks[key]
				};
			});
		},

		getServer: function (network) {
			var url = networks[network];
			return new StellarSdk.Server(url);
		}

	};
});
