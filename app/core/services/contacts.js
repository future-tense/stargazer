/* global angular, console, toml */

import 'ionic-sdk/release/js/ionic.bundle';

angular.module('app.service.contacts', [])
.factory('Contacts', function (Horizon, Storage) {
	'use strict';

	function ignoreCase(stringA, stringB) {
		const nameA = stringA.toUpperCase();
		const nameB = stringB.toUpperCase();
		return (nameA > nameB) - (nameA < nameB);
	}

	const contacts = Storage.getItem('contacts') || {};

	return {

		forNetwork: function (network) {
			const res = [];
			Object.keys(contacts).forEach(name => {
				const contact = contacts[name];
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

			const matches = [];
			Object.keys(contacts).forEach(name => {
				const contact = contacts[name];
				if (!contact.network) {
					contact.network = Horizon.public;
				}

				if ((contact.id === accountId) && (contact.network === network)) {
					matches.push(name);
				}
			});

			if (memoType && memo) {
				const memoContact = matches.filter(name => {
					const contact = contacts[name];
					return ((memoType === contact.memo_type) && (memo === contact.memo));
				});

				if (memoContact.length) {
					return memoContact[0];
				}
			}

			const contact = matches.filter(name => {
				const contact = contacts[name];
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
