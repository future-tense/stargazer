import translate from '../../core/services/translate.service';

export default class SideMenuController {

	/* @ngInject */
	constructor($rootScope, Wallet) {
		this.wallet = Wallet;
		this.accounts = Wallet.accountList;

		this.translateTexts();
		$rootScope.$on('languageChange', () => this.translateTexts());
	}

	getBadgeCount(account) {
		if (account !== this.wallet.current) {
			return account.getBadgeCount();
		} else {
			return 0;
		}
	}

	translateTexts() {
		this.text = {
			accounts: translate.instant('page.sidemenu.accounts'),
			settings: translate.instant('page.sidemenu.settings')
		};
	}

	getType(account) {
		return account.isMultiSig() ? 'icon-people' : 'icon-person';
	}

	isSelected(account) {
		return account.id === this.wallet.current.id;
	}
}
