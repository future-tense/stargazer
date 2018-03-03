
export default class SideMenuController {

	/* @ngInject */
	constructor(Wallet) {
		this.wallet = Wallet;
		this.accounts = Wallet.accountList;
	}

	getBadgeCount(account) {
		if (account !== this.wallet.current) {
			return account.getBadgeCount();
		} else {
			return 0;
		}
	}

	getType(account) {
		return account.isMultiSig() ? 'icon-people' : 'icon-person';
	}

	isSelected(account) {
		return account.id === this.wallet.current.id;
	}
}
