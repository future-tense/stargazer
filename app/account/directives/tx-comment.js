
/* global angular, console, StellarSdk */

angular.module('app')
.directive('txComment', function ($q, Contacts, Wallet) {
	'use strict';

	function link(scope, element, attrs) {

		function contact(id, network) {
			if (id) {
				if (id in Wallet.accounts) {
					return Wallet.accounts[id].alias;
				} else {
					return Contacts.lookup(id, network);
				}
			}
		}

		function txDescription(tx) {
			return {
				'account_debited':	'Sent',
				'account_credited': 'Received',
				'account_created':	'Received',
				'trade':			'Traded'
			}[tx.type];
		}

		var tx = scope.tx;

		var counterparty;
		if (tx.to) {
			counterparty = tx.to;
		} else if (tx.from) {
			counterparty = tx.from;
		}

		//	has comment
		if (tx.comment) {
			scope.comment = tx.comment;
		}

		else {
			var name = contact(counterparty, Wallet.current.network);
			if (name) {
				scope.comment = name;
			} else {
				scope.comment = txDescription(tx);
			}
		}
	}

	return {
		restrict: 'E',
		scope: {
			tx: '='
		},
		link: link,
		template: '{{comment}}'
	};
});
