/* global _, angular, console, Decimal, StellarSdk */

angular.module('app')
.factory('Wallet', function ($http, $q, $rootScope, $timeout, $window, History, Horizon, Keychain, Storage) {
	'use strict';

	//------------------------------------------------------------------------------------------------------------------
	//	Account
	//------------------------------------------------------------------------------------------------------------------

	function _sortAssetCodes(a, b) {
		return (a.asset_code > b.asset_code) - (a.asset_code < b.asset_code);
	}

	function parseBalances(res) {
		var native = res.balances.filter(function (e) {
			return e.asset_type === 'native';
		});

		var credit_alphanum4 = res.balances.filter(function (e) {
			return e.asset_type === 'credit_alphanum4';
		});

		var credit_alphanum12 = res.balances.filter(function (e) {
			return e.asset_type === 'credit_alphanum12';
		});

		credit_alphanum4.sort(_sortAssetCodes);
		credit_alphanum12.sort(_sortAssetCodes);

		native[0].asset_code = 'XLM';
		return native.concat(credit_alphanum4, credit_alphanum12);
	}

	function Account(params) {

		this.getAccountInfo = function () {

			var self = this;

			return self.horizon().accounts()
			.accountId(self.id).call()
			.catch(function (err) {
				$timeout(self.refresh.bind(self), 60000);
				return $q.reject(err);
			})
			.then(function (res) {
				self.balances		= parseBalances(res);
				self.flags			= res.flags;
				self.sequence		= res.sequence;
				self.signers		= res.signers;
				self.subentryCount	= res.subentry_count;
				self.thresholds		= res.thresholds;

				Storage.setItem('account.' + self.alias, self);
			});
		};

		$window._.extend(this, params);
		this.refresh();
	}

	Account.prototype.horizon = function () {
		return Horizon.getServer(this.network);
	};

	Account.prototype.getNativeBalance = function () {
		return this.balances[0].balance;
	};

	Account.prototype.getReserve = function () {
		return 10 * (2 + this.subentryCount);
	};

	Account.prototype.refresh = function () {

		console.log('refreshing ' + this.alias);

		if (this.closeStream) {
			this.closeStream();
		}

		var self = this;
		return this.getAccountInfo()
		.catch(function (err) {
			console.log(err);
		})
		.then(function () {
			return History.getTransactions(self, 20)
			.then(function () {
				History.subscribe(self);
			});
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	//	Wallet
	//------------------------------------------------------------------------------------------------------------------

	var accounts = {};
	var currentAccount;

	var Wallet = {
		accounts: accounts,
		get current () {
			return currentAccount;
		},
		set current (account) {
			currentAccount = account;
			Storage.setItem('currentAccount', account.alias);
		}
	};

	Wallet.createEmptyAccount = function (name, network) {

		if (!network) {
			network = Horizon.livenet;
		}

		var keys = StellarSdk.Keypair.random();
		var accountId = keys.accountId();
		var seed = keys.seed();

		Keychain.addKey(accountId, seed);

		var opts = {
			id:			accountId,
			network:	network,
			alias:		name,
			balances: [{
				asset_type: 'native',
				asset_code: 'XLM',
				balance: '0'
			}]
		};

		var self = new Account(opts);
		accounts[self.id] = self;
		Storage.setItem('account.' + self.alias, self);

		accountList.push(self.alias);
		Storage.setItem('accounts', accountList);

		Wallet.current = self;
		return self;
	};

	Wallet.importAccount = function (accountId, seed, name, network) {

		if (!network) {
			network = Horizon.livenet;
		}

		Keychain.addKey(accountId, seed);

		var opts = {
			id:			accountId,
			network:	network,
			alias:		name,
			balances: [{
				asset_type: 'native',
				asset_code: 'XLM',
				balance: '0'
			}]
		};

		var self = new Account(opts);
		accounts[self.id] = self;
		Storage.setItem('account.' + self.alias, self);

		accountList.push(self.alias);
		Storage.setItem('accounts', accountList);

		Wallet.current = self;
		return self;
	};

	Wallet.renameAccount = function (account, newName) {

		var oldName = account.alias;

		History.effects[newName] = History.effects[oldName];
		account.alias = newName;
		delete History.effects[oldName];

		Storage.setItem('account.' + newName, account);
		Storage.setItem('history.' + newName, History.effects[newName]);

		var index = accountList.indexOf(oldName);
		accountList[index] = newName;
		Storage.setItem('accounts', accountList);

/*
		if (currentAccount.alias === oldName) {
			currentAccount = account;
		}
*/
		Storage.setItem('currentAccount', newName);
		Storage.removeItem('account.' + oldName);
		Storage.removeItem('history.' + oldName);
	};

	Wallet.removeAccount = function (account) {

		if (account.closeStream) {
			account.closeStream();
		}

		var accountId = account.id;
		var index = accountList.indexOf(account.alias);
		accountList.splice(index, 1);
		Storage.setItem('accounts', accountList);

		var currentIndex = Math.max(0, index - 1);
		var currentName = accountList[currentIndex];

		var accountByName = {};
		Object.keys(Wallet.accounts).forEach(function (key) {
			var account = Wallet.accounts[key];
			accountByName[account.alias] = account;
		});

		Wallet.current = accountByName[currentName];
		Storage.removeItem('account.' + account.alias);

		delete accounts[accountId];
		Storage.removeItem('account.' + account.alias);
	};


	//------------------------------------------------------------------------------------------------------------------

	var accountList = Storage.getItem('accounts');
	if (accountList) {
		accountList.forEach(function (name) {
			var opts = Storage.getItem('account.' + name);
			var self = new Account(opts);
			accounts[self.id] = self;
		});

		var name = Storage.getItem('currentAccount');

		var accountByName = {};
		Object.keys(Wallet.accounts).forEach(function (key) {
			var account = Wallet.accounts[key];
			accountByName[account.alias] = account;
		});

		currentAccount = accountByName[name];
	}

	else {
		accountList = [];
		Wallet.createEmptyAccount('Personal Account');
	}

	//------------------------------------------------------------------------------------------------------------------

	$rootScope.$on('newTransaction', function(event, args) {

		function getAccountAsset(account, asset_code, asset_issuer) {
			var entry = account.balances.filter(function (entry) {
				if (entry.asset_code === asset_code) {
					return true;
				}
			});

			return entry.length ? entry[0] : null;
		}

		if (!(args.address in accounts)) {
			return;
		}

		var account = accounts[args.address];
		var fx = args.res;
		var asset;

		function plus(a, b) {
			return new Decimal(a).plus(new Decimal(b)).toFixed(7);
		}

		function minus(a, b) {
			return new Decimal(a).minus(new Decimal(b)).toFixed(7);
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
	});

	return Wallet;
});
