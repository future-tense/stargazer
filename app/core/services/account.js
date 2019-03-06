
import storage from './storage';
import horizon from './horizon';

const sortAssetCodes = (foo, bar) => (foo.asset_code > bar.asset_code) - (foo.asset_code < bar.asset_code);

export const sortAssets = res => {
	const native = res.filter(item => item.asset_type === 'native');
	const credits = res.filter(item => item.asset_type !== 'native');

	credits.sort(sortAssetCodes);

	/* eslint-disable camelcase */
	native[0].asset_code = 'XLM';
	/* eslint-enable camelcase */

	return native.concat(credits);
};

export class Account {

	constructor(params) {
		Object.assign(this, params);
		this.refresh();
	}

	_getAccountInfo() {

		const self = this;

		return self.horizon()
		.accounts()
		.accountId(self.id)
		.call()
		.catch((err) => {
			this.$timeout(self.refresh.bind(self), 60000);
			return Promise.reject(err);
		})
		.then((res) => {
			self.balances		= sortAssets(res.balances);
			self.flags			= res.flags;
			self.inflationDest	= res.inflation_destination;
			self.sequence		= res.sequence;
			self.signers		= res.signers;
			self.subentryCount	= res.subentry_count;
			self.thresholds		= res.thresholds;
			self.store();
		});
	}

	store() {
		storage.setItem(`account.${this.alias}`, this);
	}

	horizon() {
		return horizon.getServer(this.network);
	}

	getNativeBalance() {
		return this.balances[0].balance;
	}

	isActivated() {
		return this.balances[0].balance !== '0';
	}

	getReserve() {
		const fees = horizon.getFees(this.network);
		return fees.baseReserve * (2 + this.subentryCount);
	}

	//	return true if account has enough balance to send 'amount' XLM in a tx w/ 'numOps' operations
	canSend(amount, numOps) {
		const fees = horizon.getFees(this.network);
		return (10000000 * (this.getNativeBalance() - this.getReserve() - amount) - fees.baseFee * numOps) >= 0;
	}

	refresh() {
		if ('closeStream' in this) {
			this.closeStream();
		}

//		const self = this;
		return this._getAccountInfo()
		.then(() => this.History.getTransactions(this, 20))
		.then(() => this.History.subscribe(this))
		.catch(err => {});
	}

	//
	//	returns an array of all the assets in an account that are issued by `issuer`
	//

	getAssetsFromIssuer(issuer) {
		return this.balances.filter((asset) => {
			if (asset.asset_type === 'native') {
				return false;
			} else {
				return (asset.asset_issuer === issuer);
			}
		});
	}

	//
	//	is it possible to sign a medium threshold tx with only unencrypted local keys?
	//

	isLocallySecure() {

		if (this.getNativeBalance() === '0') {
			return this.Keychain.isEncrypted(this.id);
		}

		const signers = this.signers
		.filter(signer => signer.weight !== 0)
		.filter(signer => this.Keychain.isLocalSigner(signer.key))
		.filter(signer => !this.Keychain.isEncrypted(signer.key));

		let weight = 0;
		signers.forEach((signer) => {
			weight += signer.weight;
		});

		let threshold = this.thresholds.med_threshold;
		if (threshold === 0) {
			threshold = 1;
		}

		return (weight < threshold);
	}

	isMultiSig() {

		if (!this.signers) {
			return false;
		}

		const signers = this.signers.filter(signer => signer.weight !== 0);
		return (signers.length !== 1);
	}

	increaseBadgeCount() {
		if (!this.badgeCount) {
			this.badgeCount = 1;
		} else {
			this.badgeCount += 1;
		}
		this.store();
	}

	clearBadgeCount() {
		this.badgeCount = 0;
		this.store();
	}

	getBadgeCount() {
		if (this.badgeCount) {
			return this.badgeCount;
		} else {
			return 0;
		}
	}

	setInflationDest(dest) {
		this.inflationDest = dest;
		this.store();
	}
}
