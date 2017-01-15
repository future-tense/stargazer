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
					contact.network = Horizon.public;
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
			contacts[name] = contact;
			Storage.setItem('contacts', contacts);
		},

		delete: function (name) {
			delete contacts[name];
			Storage.setItem('contacts', contacts);
		},

		lookup: function (accountId, network, memoType, memo) {

			if (!network) {
				network = Horizon.public;
			}

			var matches = [];
			Object.keys(contacts).forEach(function (name) {
				var contact = contacts[name];
				if (!contact.network) {
					contact.network = Horizon.public;
				}

				if ((contact.id === accountId) && (contact.network === network)) {
					matches.push(name);
				}
			});

			if (memoType && memo) {
				var memoContact = matches.filter(function (name) {
					var contact = contacts[name];
					return ((memoType === contact.memo_type) && (memo === contact.memo));
				});

				if (memoContact.length) {
					return memoContact[0];
				}
			}

			var contact = matches.filter(function (name) {
				var contact = contacts[name];
				return (!contact.memo_type && !contact.memo);
			});

			if (contact.length) {
				return contact[0];
			} else {
				return null;
			}
		}
	};
});
