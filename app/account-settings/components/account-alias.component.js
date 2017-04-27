/* global angular */

(function () {
	'use strict';

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

	angular.module('app')
	.component('accountAlias', {
		controller: AccountAliasController,
		controllerAs: 'vm',
		templateUrl: 'app/account-settings/components/account-alias.html'
	});
}());
