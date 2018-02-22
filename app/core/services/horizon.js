/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';
import StellarSdk from 'stellar-sdk';

angular.module('app.service.horizon', [])
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

	function getServer(hash) {
		const url = networks[hash].server;
		return new StellarSdk.Server(url);
	}

	const fees = {};

	function getFees(hash) {

		if (!(hash in fees)) {

			const server = getServer(hash);
			server.ledgers().order('desc').limit(1).call()
			.then(function (res) {
				const ledger = res.records[0];
				fees[hash] = {
					baseFee: ledger.base_fee,
					baseReserve: ledger.base_reserve
				};
			});

			fees[hash] = {
				baseFee: 100,
				baseReserve: '0.5'
			};
		}

		return fees[hash];
	}

	return {
		public: publicNetwork,

		getHash: getHash,

		getFees: getFees,

		getMinimumAccountBalance: function (hash) {
			return getFees(hash).baseReserve * 2;
		},

		getNetwork: function (hash) {
			if (!hash) {
				hash = publicNetwork;
			}
			return networks[hash];
		},

		getNetworks: function () {
			return networkList;
		},

		getServer: getServer
	};
});
