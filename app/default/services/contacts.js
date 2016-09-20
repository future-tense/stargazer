/* global angular, console, toml */

angular.module('app')
.factory('Contacts', function (Horizon, Storage) {
	'use strict';

	var contacts = Storage.getItem('contacts') || {};

	return {

		forNetwork: function (network) {
			var res = [];
			Object.keys(contacts).forEach(function (name) {
				var contact = contacts[name];
				if (!contact.network) {
					contact.network = Horizon.livenet;
				}
				if (contact.network === network) {
					res.push(name);
				}
			});

			return res;
		},

		get: function (name) {
			return contacts[name];
		},

		add: function (name, accountId, network) {
			var contact = {
				id: accountId
			};

			if (network !== Horizon.livenet) {
				contact.network = network;
			}

			contacts[name] = contact;
			Storage.setItem('contacts', contacts);
		},

		lookup: function (accountId, network) {

			if (!network) {
				network = Horizon.livenet;
			}

			var res;
			Object.keys(contacts).forEach(function (name) {
				var contact = contacts[name];
				if (!contact.network) {
					contact.network = Horizon.livenet;
				}
				if ((contact.id === accountId) && (contact.network === network)) {
					res = name;
				}
			});

			return res;
		}
	};
});
