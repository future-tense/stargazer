/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

class ImportCentaurusController {

	constructor($location, $routeParams, Translate, CentaurusService, Keychain, Wallet) {

		this.$location = $location;
		this.Translate = Translate;
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
		this.account.alias = this.Translate.instant('account.defaultname', {number: numAccounts + 1});
	}

	importAccount() {
		const {secret, address} = this.CentaurusService.decrypt(this.cipher, this.account.password);
		this.Wallet.importAccount(address, secret, this.account.alias);
		this.$location.path('/');
	}
}

angular.module('app.component.import-centaurus', [])
.component('importCentaurus', {
	controller: ImportCentaurusController,
	controllerAs: 'vm',
	templateUrl: 'app/side-menu/components/import-centaurus.html'
});
