/* global angular, console */

(function () {
	'use strict';

	class AccountFederationController {

		constructor($http, $rootScope, Keychain, Storage, Wallet) {

			this.$http = $http;
			this.$rootScope = $rootScope;
			this.Keychain = Keychain;
			this.Storage = Storage;

			this.baseUrl = 'https://getstargazer.com/api/federation/';

			const account = Wallet.current;
			this.account = account;
			this.name = account.alias;
			this.accountId = account.id;
			this.data = {
				federation: account.federation
			};
		}

		save() {
			const signer = this.accountId;
			const url = this.baseUrl + this.data.federation;

			this.Keychain.signMessage(signer, url)
			.then(sig => {
				return this.$http.post(url, {
					id:		signer,
					sig:	sig
				})
				.then(res => {
					this.account.federation = this.data.federation;
					this.Storage.setItem(`account.${this.name}`, this.account);
					this.$rootScope.goBack();
				})
				.catch(err => console.log(err));
			});
		}
	}

	angular.module('app')
	.component('accountFederation', {
		controller: AccountFederationController,
		controllerAs: 'vm',
		templateUrl: 'app/account-settings/components/account-federation.html'
	});
}());
