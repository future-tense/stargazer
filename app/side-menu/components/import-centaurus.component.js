/* global angular, console, StellarSdk */

(function () {
	'use strict';

	class ImportCentaurusController {

		constructor($location, $routeParams, $translate, CentaurusService, Keychain, Wallet) {

			this.$location = $location;
			this.$translate = $translate;
			this.Keychain = Keychain;
			this.Wallet = Wallet;
			this.CentaurusService = CentaurusService;

			const data = JSON.parse(window.atob($routeParams.data));
			this.cipher = data.cipher;

			this.account = {};
			this.minHeight = getMinHeight();

			function getMinHeight() {
				const headerHeight = 40;
				const buttonGroupHeight = 48 + 16 + 8;
				return `${window.innerHeight - (buttonGroupHeight + headerHeight)}px`;
			}
		}

		$onInit() {
			const numAccounts = Object.keys(this.Wallet.accounts).length;
			this.account.alias = this.$translate.instant('account.defaultname', {number: numAccounts + 1});
		}

		importAccount() {
			const {secret, address} = this.CentaurusService.decrypt(this.cipher, this.account.password);
			this.Wallet.importAccount(address, secret, this.account.alias);
			this.$location.path('/');
		}
	}

	angular.module('app')
	.component('importCentaurus', {
		controller: ImportCentaurusController,
		controllerAs: 'vm',
		templateUrl: 'app/side-menu/components/import-centaurus.html'
	});
}());
