/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

(function () {
	'use strict';

	class ImportAccountController {
		constructor($ionicLoading, $location, $routeParams, Translate, Keychain, Wallet) {

			this.$ionicLoading = $ionicLoading;
			this.$location = $location;
			this.$routeParams = $routeParams;
			this.Translate = Translate;
			this.Keychain = Keychain;
			this.Wallet = Wallet;

			this.account = {};
			this.advanced = false;
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

			if (!(accountId in this.Wallet.accounts)) {
				this.Wallet.importAccount(accountId, keyStore, this.account.alias, this.account.network);
				this.$location.path('/');
			} else {
				this.$ionicLoading.show({
					template: 'Account already exists',
					duration: 700
				});
			}
		}
	}

	angular.module('app.component.import-account', [])
	.component('importAccount', {
		controller: ImportAccountController,
		controllerAs: 'vm',
		templateUrl: 'app/side-menu/components/import-account.html'
	});
}());
