/* global angular, console */

import 'ionic-sdk/release/js/ionic.bundle';
import StellarSdk from 'stellar-sdk';
import contacts from './contacts.js';

angular.module('app.service.destination', [])
.factory('Destination', function ($q, Wallet) {
	'use strict';

	const nullPromise = $q.reject();

	function lookup(name) {

		//	empty name

		if (!name) {
			return nullPromise;
		}

		//	Account Name

		const map = {};
		Wallet.accountList.forEach(account => {
			map[account.alias] = account.id;
		});

		if (name in map) {
			return $q.resolve({
				id: map[name]
			});
		}

		//	Contact Name

		const contact = contacts.get(name);
		if (contact) {
			/* eslint-disable camelcase */
			return $q.resolve({
				id: contact.id,
				memo: contact.memo,
				memo_type: contact.memo_type
			});
			/* eslint-enable camelcase */
		}

		//	Email address -- transform to emailaddress*getstargazer.com


		/* eslint-disable no-useless-escape */
		const isEmail = /^[\w\.\+]+@([\w]+\.)+[\w]{2,}$/.test(name);
		/* eslint-enable no-useless-escape */
		if (isEmail) {
			name += '*getstargazer.com';
		}

		//	Federated address or Public key
		/* eslint-disable no-useless-escape */
		const isFederation = /^[^\s\*,]+\*([\w]+\.)+[\w]{2,}$/.test(name);
		const isPubKey = StellarSdk.StrKey.isValidEd25519PublicKey(name);
		if (isFederation || isPubKey) {

			return StellarSdk.FederationServer.resolve(name)
			.then(res => {
				/* eslint-disable camelcase */
				return {
					id: res.account_id.trim(),
					memo: res.memo,
					memo_type: res.memo_type
				};
				/* eslint-enable camelcase */
			});
		}
		/* eslint-enable no-useless-escape */

		return nullPromise;
	}

	return {
		lookup: lookup
	};
});

