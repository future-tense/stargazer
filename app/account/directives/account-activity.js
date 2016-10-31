
/* global angular */

angular.module('app')
.directive('accountActivity', function ($filter, History, Wallet) {
	'use strict';

	var formatAmount = $filter('formatAmount');

	function link(scope, iElement, iAttrs) {

		function parseHistory() {
			var accountName = Wallet.current.alias;
			var effects = History.effects[accountName];

			var array = [];
			for (var fx in effects) {
				array.push(effects[fx]);
			}

			var paymentTypes = {
				'account_debited': 1,
				'account_credited': 1,
				'account_created': 1,
				'trade': 1
			};

			var filtered = array.filter(function (fx) {
				return (fx.type in paymentTypes);
			});

			filtered.forEach(function (fx) {
				if (fx.type === 'account_debited') {
					fx.desc = '-' + formatAmount(fx.amount) + ' ' + fx.asset_code;
				}

				else if (fx.type === 'account_credited') {
					fx.desc = '+' + formatAmount(fx.amount) + ' ' + fx.asset_code;
				}

				else if (fx.type === 'account_created') {
					fx.desc = '+' + formatAmount(fx.amount) + ' XLM';
				}

				else if (fx.type === 'trade') {
					if (!fx.sold_asset_code) {
						fx.sold_asset_code = 'XLM';
					}

					if (!fx.bought_asset_code) {
						fx.bought_asset_code = 'XLM';
					}

					fx.desc = '-' + formatAmount(fx.sold_amount) + ' ' + fx.sold_asset_code +
						' / +' + formatAmount(fx.bought_amount) + ' ' + fx.bought_asset_code;
				}

				var date = new Date(fx.date);
				fx.timestamp = date.getTime() / 1000;
			});

			scope.history = filtered.sort(
				function (a, b) {
					return b.id.localeCompare(a.id);
				}
			);
		}

		scope.history = [];
		parseHistory();

		scope.$on('accountInfoLoaded', function (event, args) {
			parseHistory();
		});
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
