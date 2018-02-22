/* global angular, console, EventSource, StellarSdk */

import 'ionic-sdk/release/js/ionic.bundle';

angular.module('app.service.constellation', [])
.factory('Constellation', function ($http) {
	'use strict';

	const baseUrl = 'https://constellation.futuretense.io/api/v1';

	return {
		submitSignatures:	submitSignatures,
		submitTransaction:	submitTransaction,
		subscribe:			subscribe
	};

	function submitSignatures(hash, sigs) {

		const data = {
			sig: sigs
		};

		return $http.put(`${baseUrl}/transaction/${hash}`, data);
	}

	function submitTransaction(txenv, network) {

		const data = {
			txenv: txenv,
			network: network
		};

		return $http.post(`${baseUrl}/transaction`, data);
	}

	function subscribe(pubkeys, requestFunc, progressFunc, addSignerFunc, removeSignerFunc) {

		const eventSource = new EventSource(`${baseUrl}/events/${pubkeys}`);
		eventSource.addEventListener('request', handler(requestFunc), false);
		eventSource.addEventListener('progress', handler(progressFunc), false);
		eventSource.addEventListener('add_signer', handler(addSignerFunc), false);
		eventSource.addEventListener('remove_signer', handler(removeSignerFunc), false);
		return eventSource;

		function handler(func) {
			if (func) {
				return event => func(JSON.parse(event.data));
			} else {
				return event => {};
			}
		}
	}
});
