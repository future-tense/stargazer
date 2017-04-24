/* global angular, StellarSdk */

angular.module('app')
.factory('Horizon', function () {
	'use strict';

	const networkList = [{
		name:	'Public',
		phrase: 'Public Global Stellar Network ; September 2015',
		server: 'https://horizon.stellar.org'
	}, {
		name:	'Testnet',
		phrase: 'Test SDF Network ; September 2015',
		server: 'https://horizon-testnet.stellar.org'
	}];

	function getNetwork(name) {
		return networkList.filter(network => network.name === name)[0];
	}

	function getHash(passphrase) {
		return new StellarSdk.Network(passphrase)
		.networkId()
		.toString('hex')
		.slice(0, 8);
	}

	const publicNetwork = getHash('Public Global Stellar Network ; September 2015');

	const networks = {};
	networkList.forEach(network => {
		const hash = getHash(network.phrase);
		networks[hash] = network;
	});

	return {
		public: publicNetwork,

		getHash: getHash,

		getNetwork: function (hash) {
			if (!hash) {
				hash = publicNetwork;
			}
			return networks[hash];
		},

		getNetworks: function () {
			return networkList;
		},

		getServer: function (hash) {
			const url = networks[hash].server;
			return new StellarSdk.Server(url);
		}
	};
});
