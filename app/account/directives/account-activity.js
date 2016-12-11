
/* global angular */

angular.module('app')
.directive('accountActivity', function ($filter, Contacts, History, Wallet) {
	'use strict';

	var formatAmount = $filter('formatAmount');

	function link(scope, element, attrs) {

		function parseHistory() {
			var accountName = Wallet.current.alias;
			var effects = History.effects[accountName];

			var array = [];
			for (var fx in effects) {
				array.push(effects[fx]);
			}

			var paymentTypes = {
				'account_debited': 'send',
				'account_credited': 'recv',
				'account_created': 'recv',
				'trade': 'trade'
			};

			var filtered = array.filter(function (fx) {
				return (fx.type in paymentTypes);
			});

			filtered = filtered.map(function (fx) {

				var res = {
					id: fx.id
				};

				if (fx.type === 'account_debited') {
					res.desc = '-' + formatAmount(fx.amount) + ' ' + fx.asset_code;
					res.amount = fx.amount;
					res.asset_code = fx.asset_code;
				}

				else if (fx.type === 'account_credited') {
					res.desc = '+' + formatAmount(fx.amount) + ' ' + fx.asset_code;
					res.amount = fx.amount;
					res.asset_code = fx.asset_code;
				}

				else if (fx.type === 'account_created') {
					res.desc = '+' + formatAmount(fx.amount) + ' XLM';
					res.amount = fx.amount;
					res.asset_code = 'XLM';
				}

				else if (fx.type === 'trade') {
					if (!fx.sold_asset_code) {
						fx.sold_asset_code = 'XLM';
					}

					if (!fx.bought_asset_code) {
						fx.bought_asset_code = 'XLM';
					}

					res.desc = '-' + formatAmount(fx.sold_amount) + ' ' + fx.sold_asset_code +
						' / +' + formatAmount(fx.bought_amount) + ' ' + fx.bought_asset_code;

					res.sold_amount = fx.sold_amount;
					res.sold_asset_code = fx.sold_asset_code;
					res.bought_amount = fx.bought_amount;
					res.bought_asset_code = fx.bought_asset_code;
				}

				var date = new Date(fx.date);
				res.timestamp = date.getTime() / 1000;
				res.type = paymentTypes[fx.type];

				var counterparty;
				if (fx.to) {
					counterparty = fx.to;
				} else if (fx.from) {
					counterparty = fx.from;
				}
				res.counterparty = counterparty;

				return res;
			});

			scope.history = filtered.sort(
				function (a, b) {
					return (a.id < b.id) - (a.id > b.id);
				}
			);
		}

		scope.history = [];
		parseHistory();

		scope.$on('accountInfoLoaded', function (event, args) {
			parseHistory();
		});

		scope.getComment = function (tx) {

			function contact(id, network) {
				if (id) {
					if (id in Wallet.accounts) {
						return Wallet.accounts[id].alias;
					} else {
						return Contacts.lookup(id, network);
					}
				}
			}

			if (tx.comment) {
				return tx.comment;
			}

			else {
				var name = contact(tx.counterparty, Wallet.current.network);
				if (name) {
					return name;
				} else {
					return {
						'send':	'transaction.sent',
						'recv': 'transaction.received',
						'trade':'transaction.traded'
					}[tx.type];
				}
			}
		};
	}

	return {
		restrict: 'AE',
		scope: {
			account: '=',
			limit: '@',
			filter: '@'
		},
		link: link,
		templateUrl: 'app/account/templates/account-activity.html'
	};
});
