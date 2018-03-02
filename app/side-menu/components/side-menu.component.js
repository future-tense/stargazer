/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

import sideMenuTemplate from './side-menu.html';

class SideMenuController {

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

angular.module('app.component.side-menu', [])
.component('sideMenu', {
	controller: SideMenuController,
	controllerAs: 'vm',
	template: sideMenuTemplate
});
