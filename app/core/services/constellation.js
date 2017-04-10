/* global angular, buffer, console, EventSource, StellarSdk */

angular.module('app')
.factory('Constellation', function ($http) {
	'use strict';

	var baseUrl = 'https://constellation.futuretense.io/api';

	return {
		submitSignatures:	submitSignatures,
		submitTransaction:	submitTransaction,
		subscribe:			subscribe
	};

	/**
	 * Submits a signatures to the signature server
	 *
	 * @param tx
	 * @param sigs
	 * @returns {*}
	 */
	function submitSignatures(hash, sigs) {

		var data = {
			sig: sigs
		};

		return $http.put(
			baseUrl + '/transaction/' + hash,
			data
		);
	}

	/**
	 * Submits a transaction to the signature server
	 *
	 * @param tx -
	 * @param network
	 * @returns {*}
	 */
	function submitTransaction(txenv, network) {

		var data = {
			txenv: txenv,
			network: network
		};

		return $http.post(
			baseUrl + '/transaction',
			data
		);
	}

	/**
	 * Subscribe to push notifications for a specific address.
	 *
	 * @param address - The address to subscribe for events
	 * @param requestFunc
	 * @param progressFunc
	 */
	function subscribe(address, requestFunc, progressFunc) {

		function requestHandler(e) {
			var payload = JSON.parse(e.data);
			if (requestFunc) {
				requestFunc(payload);
			}
		}

		function progressHandler(e) {
			var payload = JSON.parse(e.data);
			if (progressFunc) {
				progressFunc(payload);
			}
		}

		var evtSource = new EventSource(baseUrl + '/events/' + address);
		evtSource.addEventListener('request', requestHandler, false);
		evtSource.addEventListener('progress', progressHandler, false);
		return evtSource;
	}
});
