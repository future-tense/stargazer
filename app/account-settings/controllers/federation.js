/* global angular, console, StellarSdk */

angular.module('app')
.controller('AccountFederationCtrl', function ($http, $rootScope, $scope, Keychain, Storage, Wallet) {
	'use strict';

	const baseUrl = 'https://getstargazer.com/api/federation/';

	$scope.name = Wallet.current.alias;
	$scope.accountId = Wallet.current.id;
	$scope.data = {
		federation: Wallet.current.federation
	};

	$scope.save = function () {

		const signer = Wallet.current.id;
		const url = baseUrl + $scope.data.federation;

		Keychain.signMessage(signer, url)
		.then(sig => {
			return $http.post(url, {
				id:		signer,
				sig:	sig
			})
			.then(res => {
				Wallet.current.federation = $scope.data.federation;
				Storage.setItem(`account.${Wallet.current.alias}`, Wallet.current);
				$rootScope.goBack();
			})
			.catch(err => console.log(err));
		});
	};
})
.directive('validFederation', function ($http, $q) {
	'use strict';

	return {
		require: 'ngModel',
		link: function (scope, element, attributes, ngModel) {
			ngModel.$asyncValidators.validFederation = function (name) {

				if (!name) {
					return $q.reject();
				}

				const url = 'https://getstargazer.com/api/federation';
				return $http.get(url, {
					/* eslint-disable id-length */
					params: {
						q: `${name}*getstargazer.com`,
						type: 'name'
					}
					/* eslint-enable id-length */
				})
				.then(res => {
					if (res.data.account_id !== attributes.accountid) {
						return $q.reject();
					}
				})
				.catch(err => console.log(err));
			};
		}
	};
});
