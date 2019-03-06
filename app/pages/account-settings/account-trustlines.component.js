
import StellarSdk from 'stellar-sdk';
import addTrustlineModal from './add-trustline.html';

export default class AccountTrustlinesController {

	/* @ngInject */
	constructor($location, Anchors, Destination, Modal, Reviewer, Wallet) {

		this.$location = $location;
		this.Anchors = Anchors;
		this.Destination = Destination;
		this.Modal = Modal;
		this.Reviewer = Reviewer;

		this.account = Wallet.current;
		this.minHeight = this.getMinHeight();
		this.anchors = this.getAnchors();
	}

	addAnchor() {
		this.Modal.show(addTrustlineModal)
		.then(res => {
			this.Destination.lookup(res.anchor)
			.then(destInfo => {
				this.addAsset({
					issuer: destInfo.id,
					code:   res.asset
				});
			})
			.catch(() => {
				this.Anchors.lookup(res.anchor)
				.then(assetList => assetList.forEach(
					asset => this.addAsset(asset)
				));
			});
		});
	}

	addAsset(asset) {
		const ids = this.anchors.map(item => item.id);
		const index = ids.indexOf(asset.issuer);

		const value = {
			/* eslint-disable camelcase */
			object: {
				asset_issuer:	asset.issuer,
				asset_code:		asset.code,
				balance:		'0.0000000'
			},
			state:		false,
			oldState:	false
			/* eslint-enable camelcase */
		};

		if (index === -1) {
			this.anchors.push({
				id:			asset.issuer,
				trustlines: [
					value
				]
			});
		} else {
			const trustlines = this.anchors[index].trustlines;
			trustlines.push(value);
		}
	}

	createTransaction(account) {

		const builder = new StellarSdk.TransactionBuilder(account)
		.setTimeout(0);

		function addOperation(trustline) {
			const object = trustline.object;
			const params = {
				asset: new StellarSdk.Asset(object.asset_code, object.asset_issuer)
			};

			if (trustline.state === false) {
				params.limit = '0';
			}

			builder.addOperation(StellarSdk.Operation.changeTrust(params));
		}

		this.anchors.forEach(anchor => {
			anchor.trustlines
			.filter(trustline => trustline.state !== trustline.oldState)
			.forEach(addOperation);
		});

		const tx = builder.build();

		return {
			tx: tx,
			network: this.account.network
		};
	}

	getAnchors() {
		const anchors = {};
		this.account.balances.forEach(balance => {
			if (balance.asset_type === 'native') {
				return;
			}

			if (!(balance.asset_issuer in anchors)) {
				anchors[balance.asset_issuer] = [];
			}
			anchors[balance.asset_issuer].push({
				object: balance,
				state: true,
				oldState: true
			});
		});

		return Object.keys(anchors).map(key => {
			return {
				id: key,
				trustlines: anchors[key]
			};
		});
	}

	getMinHeight() {
		const headerHeight = 40;
		const numButtons = 1 + (this.isDirty === true);
		const buttonGroupHeight = 48 * numButtons + 8 * (numButtons - 1) + 16 + 8;
		return `${window.innerHeight - (buttonGroupHeight + headerHeight)}px`;
	}

	getTrustlines() {
		return this.account.balances.filter(balance => {
			return balance.asset_type !== 'native';
		});
	}

	hasBalance(trustline) {
		return trustline.object.balance !== '0.0000000';
	}

	onChange() {
		let pristine = true;
		this.anchors.forEach(anchor => {
			anchor.trustlines.forEach(trustline => {
				pristine = pristine && (trustline.state === trustline.oldState);
			});
		});

		this.isDirty = !pristine;
		this.minHeight = this.getMinHeight();
	}

	updateTrustlines() {

		this.account.horizon()
		.loadAccount(this.account.id)
		.then(res => this.createTransaction(res))
		.then(this.Reviewer.review)
		.then(this.account.refresh)
		.then(() => this.$location.path('/'));
	}
}
