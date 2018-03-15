/* global _, angular, console, Decimal */

import 'ionic-sdk/release/js/ionic.bundle';
import StellarSdk from 'stellar-sdk';
import Decimal from 'decimal.js';

import {Account} from './account';
import horizon from './horizon';
import storage from './storage';

angular.module('app.service.wallet', [])
.factory('Wallet', function ($rootScope, $timeout, History, Keychain) {

	Account.prototype.$timeout = $timeout;
	Account.prototype.History  = History;
	Account.prototype.Keychain = Keychain;

	const accounts = {};
	let currentAccount;

	const Wallet = {
		accounts: accounts,
		get current() {
			return currentAccount;
		},
		set current(account) {
			currentAccount = account;
			storage.setItem('currentAccount', account.alias);
		}
	};

	Wallet.createEmptyAccount = function (name, network) {
		const keys = StellarSdk.Keypair.random();
		const publicKey = keys.publicKey();
		const secret = keys.secret();
		return Wallet.importAccount(publicKey, secret, name, network);
	};

	Wallet.hasAccount = function (name, network) {
		const nameList = Wallet.accountList
		.filter(account => account.network === network)
		.map(account => account.alias);

		const names = new Set(nameList);
		return names.has(name);
	};

	Wallet.importAccount = function (accountId, seed, name, network) {

		if (!network) {
			network = horizon.public;
		}

		if (seed) {
			Keychain.addKey(accountId, seed);
		}

		/* eslint-disable camelcase */
		const opts = {
			id:			accountId,
			network:	network,
			alias:		name,
			balances: [{
				asset_type: 'native',
				asset_code: 'XLM',
				balance: '0'
			}]
		};
		/* eslint-enable camelcase */

		const self = new Account(opts);
		if (accountId in accounts) {
			return self;
		}

		accounts[self.id] = self;
		storage.setItem(`account.${self.alias}`, self);

		accountList.insert(self);
		accountList.save();

		$rootScope.$broadcast('account added');
		Wallet.current = self;
		return self;
	};

	Wallet.renameAccount = function (account, newName) {

		const oldName = account.alias;
		if (oldName === newName) {
			return;
		}

		History.effects[newName] = History.effects[oldName];
		account.alias = newName;
		delete History.effects[oldName];

		const index = accountList.remove(account);
		accountList.insert(account);

		storage.setItem(`account.${newName}`, account);
		storage.setItem(`history.${newName}`, History.effects[newName]);
		accountList.save();
		storage.setItem('currentAccount', newName);
		storage.removeItem(`account.${oldName}`);
		storage.removeItem(`history.${oldName}`);
	};

	Wallet.removeAccount = function (account) {

		if (account.closeStream) {
			account.closeStream();
		}

		const index = accountList.remove(account);
		accountList.save();

		const currentIndex = Math.max(0, index - 1);
		Wallet.current = accountList[currentIndex];
		storage.setItem('currentAccount', Wallet.current.alias);

		delete accounts[account.id];

		const name = account.alias;
		delete History.effects[name];
		storage.removeItem(`account.${name}`);
		storage.removeItem(`history.${name}`);
	};

	Wallet.getAssetCodeCollisions = function (assets) {
		const seen = {};
		const collisions = {};
		assets.forEach((asset) => {
			if (asset.asset_type !== 'native') {
				const code = asset.asset_code;
				const issuer = asset.asset_issuer;
				if (code in seen) {
					if (!(issuer in seen[code])) {
						collisions[asset.asset_code] = 1;
					}
				} else {
					seen[code] = {};
				}
				seen[code][issuer] = 1;
			}
		});

		return collisions;
	};

	const getNextSharedAccountNumber = () => {
		return Wallet.accountList.filter(item => item.isMultiSig()).length + 1;
	};

	const getNextPersonalAccountNumber = () => {
		return Wallet.accountList.filter(item => !item.isMultiSig()).length + 1;
	};

	const isMultiSig = (account) => {

		if (!account.signers) {
			return false;
		}

		const signers = account.signers.filter(signer => signer.weight !== 0);
		return (signers.length !== 1);
	};

	Wallet.setDefaultName = function (account) {

		return horizon.getServer(account.network)
		.accounts()
		.accountId(account.id)
		.call()
		.then(res => {
			//	figure out if personal or shared
			if (isMultiSig(res)) {
				const number = getNextSharedAccountNumber();
				account.alias = `Shared Account #${number}`;
			} else {
				const number = getNextPersonalAccountNumber();
				account.alias = `Personal Account #${number}`;
			}
		})
		.catch(err => {
			const number = getNextPersonalAccountNumber();
			account.alias = `Personal Account #${number}`;
		});
	};

	// -----------------------------------------------------------------------------------------------------------------

	let accountList = storage.getItem('accounts');
	if (accountList) {
		accountList = accountList.map((name) => {
			const opts = storage.getItem(`account.${name}`);
			const self = new Account(opts);
			accounts[self.id] = self;
			return self;
		});

		const accountByName = {};
		accountList.forEach((account) => {
			accountByName[account.alias] = account;
		});

		const currentName = storage.getItem('currentAccount');
		currentAccount = accountByName[currentName];
	}

	else {
		accountList = [];
	}

	accountList.insert = function (account) {

		if (!this.length) {
			return this.push(account);
		}

		const self = this;
		const found = self.some((item, index) => {
			if (item.alias.localeCompare(account.alias) > 0) {
				self.splice(index, 0, account);
				return true;
			}
			return false;
		});

		if (!found) {
			this.push(account);
		}
	};

	accountList.remove = function (account) {
		const index = this.indexOf(account);
		this.splice(index, 1);
		return index;
	};

	accountList.save = function () {
		const accountNames = this.map(account => account.alias);
		storage.setItem('accounts', accountNames);
	};

	Wallet.accountList = accountList;

	// -----------------------------------------------------------------------------------------------------------------

	$rootScope.$on('newTransaction', (event, args) => {

		function getAccountAsset(account, assetCode, assetIssuer) {
			const entry = account.balances.filter(entry => entry.asset_code === assetCode);
			return entry.length ? entry[0] : null;
		}

		if (!(args.address in accounts)) {
			return;
		}

		const account = accounts[args.address];
		const fx = args.res;
		let asset;

		function plus(foo, bar) {
			return new Decimal(foo)
			.plus(new Decimal(bar))
			.toFixed(7);
		}

		function minus(foo, bar) {
			return new Decimal(foo)
			.minus(new Decimal(bar))
			.toFixed(7);
		}

		if (fx.type === 'account_credited') {
			asset = getAccountAsset(account, fx.asset_code, fx.asset_issuer);
			asset.balance = plus(asset.balance, fx.amount);
		}

		else if (fx.type === 'account_debited') {
			asset = getAccountAsset(account, fx.asset_code, fx.asset_issuer);
			if (asset) {			//	if issuing asset, we don't track balances
				asset.balance = minus(asset.balance, fx.amount);
			}
		}

		else if (fx.type === 'trade') {
			asset = getAccountAsset(account, fx.sold_asset_code, fx.sold_asset_issuer);
			asset.balance = minus(asset.balance, fx.sold_amount);

			asset = getAccountAsset(account, fx.bought_asset_code, fx.bought_asset_issuer);
			asset.balance = plus(asset.balance, fx.bought_amount);
		}

		else if (fx.type === 'account_removed') {
			/* eslint-disable camelcase */
			account.balances = [{
				asset_type: 'native',
				asset_code: 'XLM',
				balance: '0'
			}];
			/* eslint-enable camelcase */

			storage.setItem(`account.${account.alias}`, account);
		}

		if (account !== Wallet.current) {
			account.increaseBadgeCount();
		}
	});

	return Wallet;
});
