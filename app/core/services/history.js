/* global angular, console, localStorage, EventSource */

import 'ionic-sdk/release/js/ionic.bundle';
import storage from '../../core/services/storage.js';

function copyAmount(res, fx, prefix) {

	if (!prefix) {
		prefix = '';
	}

	res[`${prefix}amount`] = fx[`${prefix}amount`];
	if (fx.asset_type === 'native') {
		res[`${prefix}asset_code`] = 'XLM';
	} else {
		res[`${prefix}asset_code`] = fx[`${prefix}asset_code`];
		res[`${prefix}asset_issuer`] = fx[`${prefix}asset_issuer`];
	}
}

function parseEffect(fx, op, tx) {

	let res = {
		id:			fx.id,
		type:		fx.type,
		hash:		tx.hash,
		date:		tx.created_at,
		numOps: 	tx.operation_count,
		memo:		tx.memo,
		memoType:	tx.memo_type
	};

	/* eslint-disable camelcase */
	const handlers = {
		'account_created': function () {
			res.from	= op.funder;
			res.amount	= fx.starting_balance;
		},
		'account_removed': function () {
		},
		'account_credited': function () {
			if (op.type === 'path_payment' && op.from === op.to) {
				res = null;
			} else if (op.type === 'account_merge') {
				res.from = op.account;
				copyAmount(res, fx);
			} else {
				res.from = op.from;
				copyAmount(res, fx);
			}
		},
		'account_debited': function () {
			if (op.type === 'path_payment' && op.from === op.to) {
				res = null;
			} else {
				res.to = op.to || op.account;	// op.payment || op.create_account(?)
				copyAmount(res, fx);
			}
		},
		'account_flags_updated': function () {
		},
		'account_home_domain_updated': function () {
			res.domain = fx.home_domain;
		},
		'account_thresholds_updated': function () {
		},
		'data_created': function () {
		},
		'data_removed': function () {
		},
		'data_updated': function () {
		},
		'offer_created': function () {
		},
		'offer_removed': function () {
		},
		'offer_updated': function () {
		},
		'signer_created': function () {
			res.public_key	= fx.public_key;
			res.weight		= fx.weight;
		},
		'signer_removed': function () {
			res.public_key = fx.public_key;
		},
		'signer_updated': function () {
		},
		'trade': function () {
			if (op.type === 'path_payment' && op.from !== op.to && op.from === fx.account) {
				res = null;
			} else {
				copyAmount(res, fx, 'sold_');
				copyAmount(res, fx, 'bought_');
			}
		},
		'trustline_created': function () {
			res.asset_code		= fx.asset_code;
			res.asset_issuer	= fx.asset_issuer;
			res.limit			= fx.limit;
		},
		'trustline_removed': function () {
		},
		'trustline_updated': function () {
			res.asset_code		= fx.asset_code;
			res.asset_issuer	= fx.asset_issuer;
			res.limit			= fx.limit;
		},
		'trustline_authorized': function () {
		},
		'trustline_deauthorized': function () {
		}
	};
	/* eslint-enable camelcase */

	if (fx.type in handlers) {
		handlers[fx.type]();
	} else {
		console.log(fx);
		console.log(op);
		console.log(tx);
	}

	return res;
}

angular.module('app.service.history', [])
.factory('History', function ($http, $q, $rootScope) {

	function addEffect(effect, account) {

		const accountEffects = History.effects[account.alias];

		return effect.operation()
		.then((operation) => {
			return operation.transaction()
			.then((transaction) => {
				const res = parseEffect(effect, operation, transaction);
				if (res) {
					accountEffects[res.id] = res;
					return {
						res:		res,
						address:	account.id
					};
				} else {
					return $q.reject();
				}
			});
		});
	}

	const History = {};
	History.effects = {};

	const accountList = storage.getItem('accounts') || [];
	accountList.forEach((name) => {
		History.effects[name] = storage.getItem(`history.${name}`) || {};
	});

	History.subscribe = function (account) {

		let promise = $q.when();

		function onmessage(msg) {
			if (msg.id in History.effects[account.alias]) {
				return;
			}

			function add() {
				addEffect(msg, account)
				.then((effect) => {
					account.pagingToken = msg.paging_token;
					$rootScope.$broadcast('accountInfoLoaded');
					$rootScope.$broadcast('newTransaction', effect);
					storage.setItem(`history.${account.alias}`, History.effects[account.alias]);
					storage.setItem(`account.${account.alias}`, account);
				})
				.catch(() => {
					account.pagingToken = msg.paging_token;
					storage.setItem(`account.${account.alias}`, account);
				});
			}

			promise = promise.then(add);
		}

		account.closeStream = account.horizon().effects()
		.forAccount(account.id)
		.cursor(account.pagingToken)
		.stream({
			onmessage: onmessage,
			onerror: function (err) {return err;}
		});
	};

	History.getTransactions = function (account, limit) {

		if (!(account.alias in History.effects)) {
			History.effects[account.alias] = {};
		}

		const accountEffects = History.effects[account.alias];

		return account.horizon().effects()
		.forAccount(account.id)
		.limit(limit)
		.cursor('now')
		.order('desc')
		.call()
		.then((effects) => {

			if (effects.records.length !== 0) {
				account.pagingToken = effects.records[0].paging_token;
			}

			//	filter out effects we already have recorded
			const records = effects.records.filter(fx => !(fx.id in accountEffects));

			const promises = records.map(fx => {
				return addEffect(fx, account)
				.catch(err => err);
			});

			return $q.all(promises)
			.then(() => {
				storage.setItem(`history.${account.alias}`, accountEffects);
				$rootScope.$broadcast('accountInfoLoaded');
			});
		});
	};

	return History;
});
