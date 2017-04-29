/* global angular, console, StellarSdk */

(function () {
	'use strict';

	class ImportAccountController {
		constructor($location, $routeParams, Translate, Keychain, Wallet) {

			this.$location = $location;
			this.$routeParams = $routeParams;
			this.Translate = Translate;
			this.Keychain = Keychain;
			this.Wallet = Wallet;

			this.account = {};
			this.advanced = false;
			this.minHeight = getMinHeight();

			function getMinHeight() {
				const headerHeight = 40;
				const buttonGroupHeight = 48 + 16 + 8;
				return `${window.innerHeight - (buttonGroupHeight + headerHeight)}px`;
			}
		}

		$onInit() {
			if (this.$routeParams.data) {
				const data = JSON.parse(window.atob(this.$routeParams.data));
				this.isEncrypted = (typeof data.key === 'object');
				this.isScanned = true;
				this.account.seed = data.key;
				this.account.network = data.account.network;
			}

			const numAccounts = Object.keys(this.Wallet.accounts).length;
			this.account.alias = this.Translate.instant('account.defaultname', {number: numAccounts + 1});
		}

		importAccount() {
			const keyStore  = this.account.seed;
			const accountId = this.Keychain.idFromKey(keyStore, this.account.password);
			this.Wallet.importAccount(accountId, keyStore, this.account.alias, this.account.network);
			this.$location.path('/');
		}
	}

	angular.module('app')
	.component('importAccount', {
		controller: ImportAccountController,
		controllerAs: 'vm',
		templateUrl: 'app/side-menu/components/import-account.html'
	});

}());
