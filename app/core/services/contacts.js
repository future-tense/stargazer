/* global */

import horizon from './horizon.js';
import storage from './storage.js';

const contacts = storage.getItem('contacts') || {};

function ignoreCase(stringA, stringB) {
	const nameA = stringA.toUpperCase();
	const nameB = stringB.toUpperCase();
	return (nameA > nameB) - (nameA < nameB);
}

export default {

	forNetwork: function (network) {
		const res = [];
		Object.keys(contacts).forEach(name => {
			const contact = contacts[name];
			if (!contact.network) {
				contact.network = horizon.public;
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
		storage.setItem('contacts', contacts);
	},

	delete: function (name) {
		delete contacts[name];
		storage.setItem('contacts', contacts);
	},

	lookup: function (accountId, network, memoType, memo) {

		if (!network) {
			network = horizon.public;
		}

		const matches = [];
		Object.keys(contacts).forEach(name => {
			const contact = contacts[name];
			if (!contact.network) {
				contact.network = horizon.public;
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
