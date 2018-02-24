/* global angular, console, Decimal */

import 'ionic-sdk/release/js/ionic.bundle';
import StellarSdk from 'stellar-sdk';
import 'decimal.js';
import contacts from '../../core/services/contacts.js';
import horizon from '../../core/services/horizon.js';

function createAsset(json, prefix) {
	if (!prefix) {
		prefix = '';
	}

	if (json[`${prefix}asset_type`] === 'native') {
		return StellarSdk.Asset.native();
	} else {
		return new StellarSdk.Asset(
			json[`${prefix}asset_code`],
			json[`${prefix}asset_issuer`]
		);
	}
}

class SendController {

	constructor($location, Commands, Modal, QRScanner, Reviewer, Wallet) {
		this.$location = $location;
		this.Commands = Commands;
		this.Modal = Modal;
		this.QRScanner = QRScanner;
		this.Reviewer = Reviewer;
		this.Wallet = Wallet;
	}

	$onInit() {
		this.advanced = false;
		this.destinationAssets = [];
		this.send = {};
		this.forms = {};
		this.flags = {};

		this.assetCodeCollisions = null;
		this.hasPath			= false;
		this.isPathPending		= true;
		this.isPreFilled		= false;
		this.hasCamera			= this.QRScanner.hasCamera;

		this.minimumAccountBalance = horizon.getMinimumAccountBalance(this.Wallet.current.network);
		this.state = 1;

		const query = this.$location.search();
		if (Object.keys(query).length !== 0) {
			this.send.destination = query.destination;
			this.send.amount		= query.amount;
			this.send.asset 		= query;
			this.destinationAssets.push(query);

			if (query.memo) {
				/* eslint-disable camelcase */
				this.send.memo_type = query.memo.type;
				this.send.memo      = query.memo.value;
				/* eslint-enable camelcase */
			}

			this.updateCollisions(this.destinationAssets.concat(this.Wallet.current.balances));

			this.isPreFilled = true;

			this.send.destInfo = {
				id: query.destination
			};

			this.getPaths();
		}
	}

	isEmail(address) {
		/* eslint-disable no-useless-escape */
		return /^[\w\.\+]+@([\w]+\.)+[\w]{2,}$/.test(address);
		/* eslint-enable no-useless-escape */
	}

	getAssetDescription(asset) {
		if (asset.asset_type !== 'native') {
			if (asset.asset_code in this.assetCodeCollisions) {
				return `${asset.asset_code}.${asset.asset_issuer}`;
			} else {
				return asset.asset_code;
			}
		} else {
			return 'XLM';
		}
	}

	getSourceAssetDescription(path) {
		/* eslint-disable camelcase */
		return this.getAssetDescription({
			asset_type:		path.source_asset_type,
			asset_code:		path.source_asset_code,
			asset_issuer:	path.source_asset_issuer
		});
		/* eslint-enable camelcase */
	}

	hasContacts() {
		return contacts.forNetwork(this.Wallet.current.network).length !== 0;
	}

	onAmount() {
		this.getPaths();
	}

	onAsset() {
		this.getPaths();
	}

	onDestInfo(destInfo) {

		if (this.isPreFilled) {
			return;
		}

		if (!destInfo) {
			this.hasPath = false;
			this.isPathPending = true;
			delete this.send.amount;
			return;
		}

		const currentAccount = this.Wallet.current;

		currentAccount.horizon()
		.accounts()
		.accountId(destInfo.id)
		.call()

		//	destInfo.id is a registered account

		.then(res => {
			/* eslint-disable camelcase */
			if (destInfo.memo_type) {
				this.send.memo_type	= destInfo.memo_type;
				this.send.memo		= destInfo.memo;
			} else {
				this.send.memo_type	= null;
				this.send.memo		= null;
			}
			/* eslint-enable camelcase */

			const assetSortFunction = function (foo, bar) {
				return foo.asset_code > bar.asset_code;
			};

			this.updateCollisions(res.balances.concat(this.Wallet.current.balances));

			//	append any issuing assets we hold in the wallet
			const issuing = currentAccount.getAssetsFromIssuer(destInfo.id);

			const assets = res.balances.concat(issuing);
			const native = assets.filter(item => item.asset_type === 'native');
			const creditAlphanum4 = assets.filter(item => item.asset_type === 'credit_alphanum4');
			const creditAlphanum12 = assets.filter(item => item.asset_type === 'credit_alphanum12');

			creditAlphanum4.sort(assetSortFunction);
			creditAlphanum12.sort(assetSortFunction);

			/* eslint-disable camelcase */
			native[0].asset_code = 'XLM';
			/* eslint-enable camelcase */
			this.destinationAssets = native.concat(creditAlphanum4, creditAlphanum12);
			this.send.asset = this.destinationAssets[0];
			this.flags.isUnregistered = false;
		})

		//	destInfo.id is not (currently) a registered account

		.catch(() => {

			/* eslint-disable camelcase */
			const assets = [{
				asset_type: 'native',
				asset_code: 'XLM'
			}];
			/* eslint-enable camelcase */

			const issuing = currentAccount.getAssetsFromIssuer(destInfo.id);
			this.destinationAssets = assets.concat(issuing);

			this.updateCollisions(this.Wallet.current.balances);

			this.send.asset = this.destinationAssets[0];
			this.flags.isUnregistered = true;
		});
	}

	onValidAddress(res) {
		this.send.destInfo = res;
		this.onDestInfo(res);
	}

	showUnregistered() {
		return this.flags.isUnregistered && this.send.destInfo && this.isPathPending;
	}

	showPaths() {
		return this.hasPath && !this.isPathPending;
	}

	showNoPaths() {
		return !this.hasPath && !this.isPathPending;
	}

	showRaw() {
		return this.send.destInfo && (this.send.destInfo.id !== this.send.destination);
	}

	selectAccount() {
		const data = {
			network: this.Wallet.current.network,
			heading: 'modal.recipient.heading'
		};

		this.Modal.show('app/core/modals/select-account.html', data)
		.then(dest => {
			this.send.destination = dest;
		});
	}

	selectContact() {
		const data = {
			network: this.Wallet.current.network,
			heading: 'Select Contact'
		};

		this.Modal.show('app/core/modals/select-contact.html', data)
		.then(dest => {
			this.send.destination = dest;
		});
	}

	selectFromQR() {
		this.QRScanner.open()
		.then(this.Commands.onContact)
		.then(dest => {
			this.send.destination = dest;
		});
	}

	getPaths() {

		this.isPathPending	= true;
		this.hasPath		= false;

		if (!this.send.amount) {
			return;
		}

		if (this.flags.isUnregistered &&
			this.send.asset.asset_type === 'native' &&
			this.send.amount < this.minimumAccountBalance
		) {
			return;
		}

		const currentAccount = this.Wallet.current;
		const source = currentAccount.id;

		//	check if we're the issuing account for this asset
		if (this.send.asset.asset_type !== 'native' &&
			this.send.asset.asset_issuer === source
		) {
			const code = this.send.asset.asset_code;
			const amount = this.send.amount.toString();

			/* eslint-disable camelcase */
			this.send.pathRecords = [{
				destination_amount: amount,
				destination_asset_code: code,
				destination_asset_issuer: source,
				source_amount: amount,
				source_asset_code: code,
				source_asset_issuer: source,
				path: [],
				enabled: true
			}];
			/* eslint-enable camelcase */

			this.isPathPending = false;
			this.hasPath = true;
			return;
		}

		if (this.flags.isUnregistered &&
			this.send.asset.asset_type === 'native'
		) {
			const amount = this.send.amount.toString();

			/* eslint-disable camelcase */
			this.send.pathRecords = [{
				destination_amount: amount,
				destination_asset_type: 'native',
				source_amount: amount,
				source_asset_type: 'native',
				path: [],
				enabled: currentAccount.canSend(amount, 1)
			}];
			/* eslint-enable camelcase */

			this.isPathPending = false;
			this.hasPath = true;
			return;
		}

		const destInfo = this.send.destInfo;
		const asset = createAsset(this.send.asset);
		const dest = destInfo.id;

		currentAccount.horizon()
		.paths(source, dest, asset, this.send.amount)
		.call()
		.then(res => {

			if (res.records.length) {

				//
				//	filter paths... keep the cheapest path per asset,
				//	excluding paths with a zero cost
				//

				const paths = {};

				res.records
				.filter(record => record.source_amount !== '0.0000000')
				.forEach(record => {
					const key = (record.source_asset_type === 'native') ?
						'native' : record.source_asset_issuer + record.source_asset_code;

					if (key in paths) {
						if ((paths[key].source_amount - record.source_amount) > 0) {
							paths[key] = record;
						}
					} else {
						paths[key] = record;
					}
				});

				//
				//	go through the remaining paths and disable the ones that are underfunded
				//

				currentAccount.balances.forEach(asset => {
					const key = (asset.asset_code === 'XLM') ?
						'native' : asset.asset_issuer + asset.asset_code;

					if (key in paths) {
						const amount = paths[key].source_amount;
						if (asset.asset_code === 'XLM') {
							paths[key].enabled = currentAccount.canSend(amount, 1);
						} else {
							paths[key].enabled = ((asset.balance - amount) >= 0) && currentAccount.canSend(0, 1);
						}
					}
				});

				this.send.pathRecords = Object.keys(paths).map(key => paths[key]);
				this.hasPath = (this.send.pathRecords.length !== 0);
			}

			this.isPathPending = false;
		});
	}

	submit(index) {

		const currentAccount = this.Wallet.current;
		const source = currentAccount.id;

		currentAccount.horizon()
		.loadAccount(source)
		.then(account => {
			const destInfo = this.send.destInfo;

			const record = this.send.pathRecords[index];
			const sendAsset = createAsset(record, 'source_');
			const destAsset = createAsset(record, 'destination_');
			const destAmount = record.destination_amount;

			let operation;

			if (this.flags.isUnregistered && (destAsset.code === 'XLM')) {
				operation = StellarSdk.Operation.createAccount({
					destination: destInfo.id,
					startingBalance: destAmount
				});
			}

			else if (sendAsset.equals(destAsset) && (record.path.length === 0)) {
				operation = StellarSdk.Operation.payment({
					destination: destInfo.id,
					asset: destAsset,
					amount: destAmount
				});
			}

			else {
				const path = record.path.map(item => {
					return new StellarSdk.Asset(item.asset_code, item.asset_issuer);
				});

				operation = StellarSdk.Operation.pathPayment({
					sendAsset: sendAsset,
					sendMax: record.source_amount,
					destination: destInfo.id,
					destAsset: destAsset,
					destAmount: destAmount,
					path: path
				});
			}

			const builder = new StellarSdk
			.TransactionBuilder(account)
			.addOperation(operation);

			if (this.send.memo_type) {
				const memo = StellarSdk.Memo[this.send.memo_type](this.send.memo.toString());
				builder.addMemo(memo);
			}

			const tx = builder.build();
			return {
				tx: tx,
				network: currentAccount.network
			};
		})
		.then(this.Reviewer.review)
		.then(() => this.$location.path('/'))
		.catch(() => {});
	}

	updateCollisions(assets) {
		this.assetCodeCollisions = this.Wallet.getAssetCodeCollisions(assets);
	}

	next() {
		if (this.state === 1) {
			this.state = 2;
		}
	}
}

angular.module('app.component.send', [])
.component('send', {
	controller: SendController,
	controllerAs: 'vm',
	templateUrl: 'app/account/components/send.html'
});
