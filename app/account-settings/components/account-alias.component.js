/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

import accountAliasTemplate from './account-alias.html';

class AccountAliasController {

	constructor($rootScope, Wallet) {
		this.$rootScope = $rootScope;
		this.Wallet = Wallet;

		const account = Wallet.current;
		this.account = account;
		this.data = {};
		this.data.name = account.alias;
	}

	save() {
		this.Wallet.renameAccount(this.account, this.data.name);
		this.$rootScope.goBack();
	}
}

angular.module('app.component.account-alias', [])
.component('accountAlias', {
	controller: AccountAliasController,
	controllerAs: 'vm',
	template: accountAliasTemplate
});
