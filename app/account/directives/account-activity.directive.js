/* global angular */
/* jshint multistr: true */

angular.module('app')
.directive('accountActivity', function ($filter, $interval, $translate, Contacts, History, Jazzicon, Wallet) {
	'use strict';

	const formatAmount = $filter('formatAmount');

	function renderTime(now, timestamp) {
		let delta = now - timestamp;
		let message;
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

		const res = Math.floor(delta);
		return $translate.instant(message, {RES: res}, 'messageformat');
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
			const name = contact(tx.counterparty, Wallet.current.network);
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

		const now = new Date().getTime() / 1000;

		function getSeed(tx) {
			return tx.counterparty ? tx.counterparty : Wallet.current.id;
		}

		return '\
			<a class="feed-item" href="#/account/transaction/' + tx.id +'">\
				<div class="feed-item-icon" data-seed="' + getSeed(tx) + '"></div>\
				<div class="feed-item-comment">' + getComment(tx) + '</div>\
				<div class="payment">\
					<div style="text-align:right;color:#444;">' + tx.desc + '</div>\
					<div class="timestamp" time="' + tx.timestamp + '">' + renderTime(now, tx.timestamp) + '</div>\
				</div>\
				<div class="more">&raquo;</div>\
			</a>';
	}

	function link(scope, element, attrs) {

		function parseHistory() {
			const accountName = Wallet.current.alias;
			const effects = History.effects[accountName];

			const array = [];
			for (const fx in effects) {
				array.push(effects[fx]);
			}

			const paymentTypes = {
				'account_debited': 'send',
				'account_credited': 'recv',
				'account_created': 'recv',
				'trade': 'trade'
			};

			const filtered = array.filter(fx => fx.type in paymentTypes)
			.map(fx => {

				const res = {
					id: fx.id
				};

				/* eslint-disable camelcase */
				if (fx.type === 'account_debited') {
					res.desc = `-${formatAmount(fx.amount)} ${fx.asset_code}`;
					res.amount = fx.amount;
					res.asset_code = fx.asset_code;
				}

				else if (fx.type === 'account_credited') {
					res.desc = `+${formatAmount(fx.amount)} ${fx.asset_code}`;
					res.amount = fx.amount;
					res.asset_code = fx.asset_code;
				}

				else if (fx.type === 'account_created') {
					res.desc = `+${formatAmount(fx.amount)} XLM`;
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

					res.desc = `-${formatAmount(fx.sold_amount)} ${fx.sold_asset_code}` +
						` / +${formatAmount(fx.bought_amount)} ${fx.bought_asset_code}`;

					res.sold_amount = fx.sold_amount;
					res.sold_asset_code = fx.sold_asset_code;
					res.bought_amount = fx.bought_amount;
					res.bought_asset_code = fx.bought_asset_code;
				}
				/* eslint-enable camelcase */

				const date = new Date(fx.date);
				res.timestamp = date.getTime() / 1000;
				res.type = paymentTypes[fx.type];
				res.comment = fx.comment;
				res.memoType = fx.memoType;
				res.memo = fx.memo;

				if (fx.to) {
					res.counterparty = fx.to;
				} else if (fx.from) {
					res.counterparty = fx.from;
				}

				return res;
			});

			scope.history = filtered.sort(
				(foo, bar) => (foo.id < bar.id) - (foo.id > bar.id)
			);
		}

		function renderHistory() {
			let html;
			if (scope.history.length !== 0) {
				html = scope.history.map(tx => renderItem(tx)).join('');
			} else {
				const text = $translate.instant('tabs.home.activity.empty');
				html = `<div style="text-align: center" class="text-gray">${text}</div>`;
			}
			element[0].children[1].innerHTML = html;

			const list = document.getElementsByClassName('feed-item-icon');
			const elements = Array.from(list);
			elements.forEach(elem => {
				const seed = elem.getAttribute('data-seed');
				if (seed) {
					elem.appendChild(Jazzicon.render(seed));
				}
			});
		}

		function updateTime() {
			const now = new Date().getTime() / 1000;

			const list = document.getElementsByClassName('timestamp');
			const elements = Array.from(list);
			elements.forEach(elem => {
				const timestamp = elem.getAttribute('time');
				elem.textContent = renderTime(now, timestamp);
			});
		}

		parseHistory();
		renderHistory();

		scope.$on('accountInfoLoaded', (event, args) => {
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
		templateUrl: 'app/account/directives/account-activity.html'
	};
});
