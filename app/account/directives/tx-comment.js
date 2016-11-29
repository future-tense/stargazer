
/* global angular, console, StellarSdk */

angular.module('app')
.directive('txComment', function ($q, $translate, Contacts, Wallet) {
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

		function setTxDescription(tx) {

			var key = {
				'account_debited':	'transaction.sent',
				'account_credited': 'transaction.received',
				'account_created':	'transaction.received',
				'trade':			'transaction.traded'
			}[tx.type];

			$translate(key)
			.then(function (res) {
				scope.comment = res;
			});
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
				setTxDescription(tx);
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
