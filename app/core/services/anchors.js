/* global angular, toml */

angular.module('app')
.factory('Anchors', function ($http, $q) {
	'use strict';

	return {
		lookup: lookup
	};

	function lookup(domain) {

		if (!domain) {
			return $q.reject();
		}

		const url = `https://${domain}/.well-known/stellar.toml`;
		return $http.get(url)
		.then((res) => {
			try {
				const config = toml.parse(res.data);
				if (config.CURRENCIES) {
					return config.CURRENCIES;
				} else {
					return $q.reject();
				}
			} catch (exception) {
				return $q.reject();
			}
		});
	}
});
