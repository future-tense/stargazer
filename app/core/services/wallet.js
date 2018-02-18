/* global _, angular, console, Decimal, StellarSdk */

angular.module('app')
.factory('Wallet', function ($http, $q, $rootScope, $timeout, Translate, $window, History, Horizon, Keychain, Storage) {
	'use strict';

	// ------------------------------------------------------------------------
	//	Account
	// ------------------------------------------------------------------------

	function sortAssetCodes(foo, bar) {
		return (foo.asset_code > bar.asset_code) - (foo.asset_code < bar.asset_code);
	}

	function parseBalances(res) {
		const native = res.balances.filter(item => item.asset_type === 'native');
		const creditAlphanum4 = res.balances.filter(item => item.asset_type === 'credit_alphanum4');
		const creditAlphanum12 = res.balances.filter(item => item.asset_type === 'credit_alphanum12');

		creditAlphanum4.sort(sortAssetCodes);
		creditAlphanum12.sort(sortAssetCodes);

		/* eslint-disable camelcase */
		native[0].asset_code = 'XLM';
		/* eslint-enable camelcase */
		return native.concat(creditAlphanum4, creditAlphanum12);
	}

	function Account(params) {

		this.getAccountInfo = function () {

			const self = this;

			return self.horizon()
			.accounts()
			.accountId(self.id)
			.call()
			.catch((err) => {
				$timeout(self.refresh.bind(self), 60000);
				return $q.reject(err);
			})
			.then((res) => {
				self.balances		= parseBalances(res);
				self.flags			= res.flags;
				self.inflationDest	= res.inflation_destination;
				self.sequence		= res.sequence;
				self.signers		= res.signers;
				self.subentryCount	= res.subentry_count;
				self.thresholds		= res.thresholds;

				Storage.setItem(`account.${self.alias}`, self);
			});
		};

		function extend(foo, bar) {
			for (const prop in bar) {
				if (bar.hasOwnProperty(prop)) {
					foo[prop] = bar[prop];
				}
			}
		}

		extend(this, params);
		this.refresh();
	}

	Account.prototype.horizon = function () {
		return Horizon.getServer(this.network);
	};

	Account.prototype.getNativeBalance = function () {
		return this.balances[0].balance;
	};

	Account.prototype.getReserve = function () {
		const fees = Horizon.getFees(this.network);
		return fees.baseReserve * (2 + this.subentryCount);
	};

	//	return true if account has enough balance to send 'amount' XLM in a tx w/ 'numOps' operations
	Account.prototype.canSend = function (amount, numOps) {
		const fees = Horizon.getFees(this.network);
		return (10000000 * (this.getNativeBalance() - this.getReserve() - amount) - fees.baseFee * numOps) >= 0;
	};

	Account.prototype.refresh = function () {
		if (this.closeStream) {
			this.closeStream();
		}

//		const self = this;
		return this.getAccountInfo()
		.then(() => History.getTransactions(this, 20))
		.then(() => History.subscribe(this))
		.catch(err => {});
	};

	//
	//	returns an array of all the assets in an account that are issued by `issuer`
	//

	Account.prototype.getAssetsFromIssuer = function (issuer) {
		return this.balances.filter((asset) => {
			if (asset.asset_type === 'native') {
				return false;
			} else {
				return (asset.asset_issuer === issuer);
			}
		});
	};

	//
	//	is it possible to sign a medium threshold tx with only unencrypted local keys?
	//

	Account.prototype.isLocallySecure = function () {

		if (this.getNativeBalance() === '0') {
			return Keychain.isEncrypted(this.id);
		}

		const signers = this.signers
		.filter(signer => signer.weight !== 0)
		.filter(signer => Keychain.isLocalSigner(signer.public_key))
		.filter(signer => !Keychain.isEncrypted(signer.public_key));

		let weight = 0;
		signers.forEach((signer) => {
			weight += signer.weight;
		});

		let threshold = this.thresholds.med_threshold;
		if (threshold === 0) {
			threshold = 1;
		}

		return (weight < threshold);
	};

	Account.prototype.isMultiSig = function () {

		if (!this.signers) {
			return false;
		}

		const signers = this.signers.filter(signer => signer.weight !== 0);
		return (signers.length !== 1);
	};

	Account.prototype.increaseBadgeCount = function () {
		if (!this.badgeCount) {
			this.badgeCount = 1;
		} else {
			this.badgeCount += 1;
		}
		Storage.setItem(`account.${this.alias}`, this);
	};

	Account.prototype.clearBadgeCount = function () {
		this.badgeCount = 0;
		Storage.setItem(`account.${this.alias}`, this);
	};

	Account.prototype.getBadgeCount = function () {
		if (this.badgeCount) {
			return this.badgeCount;
		} else {
			return 0;
		}
	};

	Account.prototype.setInflationDest = function (dest) {
		this.inflationDest = dest;
		Storage.setItem(`account.${this.alias}`, this);
	};

	// ------------------------------------------------------------------------
	//	Wallet
	// ------------------------------------------------------------------------

	const accounts = {};
	let currentAccount;

	const Wallet = {
		accounts: accounts,
		get current() {
			return currentAccount;
		},
		set current(account) {
			currentAccount = account;
			Storage.setItem('currentAccount', account.alias);
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
			network = Horizon.public;
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
		Storage.setItem(`account.${self.alias}`, self);

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

		Storage.setItem(`account.${newName}`, account);
		Storage.setItem(`history.${newName}`, History.effects[newName]);
		accountList.save();
		Storage.setItem('currentAccount', newName);
		Storage.removeItem(`account.${oldName}`);
		Storage.removeItem(`history.${oldName}`);
	};

	Wallet.removeAccount = function (account) {

		if (account.closeStream) {
			account.closeStream();
		}

		const index = accountList.remove(account);
		accountList.save();

		const currentIndex = Math.max(0, index - 1);
		Wallet.current = accountList[currentIndex];
		Storage.setItem('currentAccount', Wallet.current.alias);

		delete accounts[account.id];

		const name = account.alias;
		delete History.effects[name];
		Storage.removeItem(`account.${name}`);
		Storage.removeItem(`history.${name}`);
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

	// -----------------------------------------------------------------------------------------------------------------

	let accountList = Storage.getItem('accounts');
	if (accountList) {
		accountList = accountList.map((name) => {
			const opts = Storage.getItem(`account.${name}`);
			const self = new Account(opts);
			accounts[self.id] = self;
			return self;
		});

		const accountByName = {};
		accountList.forEach((account) => {
			accountByName[account.alias] = account;
		});

		const currentName = Storage.getItem('currentAccount');
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
		Storage.setItem('accounts', accountNames);
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

		if (account !== Wallet.current) {
			account.increaseBadgeCount();
		}
	});

	return Wallet;
});
