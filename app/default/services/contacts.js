/* global angular, console, toml */

angular.module('app')
.factory('Contacts', function (Horizon, Storage) {
	'use strict';

	function ignoreCase(a, b) {
		var nameA = a.toUpperCase();
		var nameB = b.toUpperCase();
		return (nameA > nameB) - (nameA < nameB);
	}

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
			return res.sort(ignoreCase);
		},

		getNames: function () {
			return Object.keys(contacts).sort(ignoreCase);
		},

		get: function (name) {
			return contacts[name];
		},

		add: function (name, contact) {
			if (contact.network === Horizon.livenet) {
				delete contact.network;
			}

			contacts[name] = contact;
			Storage.setItem('contacts', contacts);
		},

		delete: function (name) {
			delete contacts[name];
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
