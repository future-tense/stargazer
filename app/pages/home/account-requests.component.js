
export default class AccountRequestController {

	/* @ngInject */
	constructor($q, Reviewer, Transactions, Wallet) {
		this.$q = $q;
		this.Reviewer = Reviewer;
		this.Transactions = Transactions;
		this.Wallet = Wallet;
		this.pubkey = Wallet.current.id;
	}

	getRequests() {
		return this.Transactions.forSigner(this.pubkey);
	}

	hasPendingRequest() {
		return this.getRequests().length !== 0;
	}

	isSigned(tx) {
		return (tx.hasSigned && this.pubkey in tx.hasSigned) ? 'Signed' : 'Unsigned';
	}

	reviewPending(context) {
		this.$q.when(context)
		.then(this.Reviewer.review)
		.catch(() => {});
	}
}
