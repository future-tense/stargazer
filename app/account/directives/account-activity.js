/* global angular */
/* jshint multistr: true */

angular.module('app')
.directive('accountActivity', function ($filter, $interval, $translate, Contacts, History, Wallet) {
	'use strict';

	var formatAmount = $filter('formatAmount');

	function renderTime(now, timestamp) {
		var delta = now - timestamp;
		var message;
		if (delta < 60) {
			message = 'timestamp.seconds';
		}
		else if (delta < 3600) {
			delta /= 60;
			message = 'timestamp.minutes';
		}
		else if (delta < 86400) {
			delta /= 3600;
			message = 'timestamp.hours';
		}
		else {
			delta /= 86400;
			message = 'timestamp.days';
		}

		var d = Math.floor(delta);
		return $translate.instant(message, {RES: d}, 'messageformat');
	}

	function getComment(tx) {

		function contact(id, network) {
			if (id) {
				if (id in Wallet.accounts) {
					return Wallet.accounts[id].alias;
				} else {
					return Contacts.lookup(id, network, tx.memoType, tx.memo);
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
				return $translate.instant({
					'send':	'transaction.sent',
					'recv': 'transaction.received',
					'trade':'transaction.traded'
				}[tx.type]);
			}
		}
	}

	function renderItem(tx) {

		var now = new Date().getTime() / 1000;

		var icon = {
			'send':	'<div class="circle circle-red"><i class="icon icon-upload"></i></div>',
			'recv':	'<div class="circle circle-green"><i class="icon icon-download"></i></div>',
			'trade':'<div class="circle circle-blue"><i class="icon icon-exchange"></i></div>'
		};

		return '\
			<a class="feed-item" href="#/account/transaction/' + tx.id +'">\
				<div class="feed-item-icon">' + icon[tx.type] + '</div>\
				<div class="feed-item-comment">' + getComment(tx) + '</div>\
				<div class="payment">\
					<div style="text-align:right;color:#444;">' + tx.desc + '</div>\
					<div class="timestamp" time="' + tx.timestamp + '">' + renderTime(now, tx.timestamp) +'</div>\
				</div>\
				<div class="more">&raquo;</div>\
			</a>';
	}

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
				res.comment = fx.comment;
				res.memoType = fx.memoType;
				res.memo = fx.memo;

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

		function renderHistory() {
			var html;
			if (scope.history.length !== 0) {
				html = scope.history.map(function (tx) {
					return renderItem(tx);
				}).join('');
			} else {
				var text = $translate.instant('tabs.home.activity.empty');
				html = '<div style="text-align: center" class="text-gray">' + text + '</div>';
			}
			element[0].children[1].innerHTML = html;
		}

		function updateTime() {
			var now = new Date().getTime() / 1000;
			var list = document.getElementsByClassName('timestamp');
			for (var i = 0; i < list.length; i++) {
				var e = list[i];
				var timestamp = e.getAttribute('time');
				e.textContent = renderTime(now, timestamp);
			}
		}

		parseHistory();
		renderHistory();

		scope.$on('accountInfoLoaded', function (event, args) {
			parseHistory();
			renderHistory();
		});

		$interval(updateTime, 1000);
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
