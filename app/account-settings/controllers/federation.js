/* global angular, console, StellarSdk */

angular.module('app')
.controller('AccountFederationCtrl', function ($http, $rootScope, $scope, Keychain, Storage, Wallet) {
	'use strict';

	var baseUrl = 'https://getstargazer.com/api/federation/';

	$scope.name = Wallet.current.alias;
	$scope.accountId = Wallet.current.id;
	$scope.data = {
		federation: Wallet.current.federation
	};

	$scope.save = function () {

		var signer = Wallet.current.id;
		Keychain.getKey(signer)
		.then(function (keys) {
			var url = baseUrl + $scope.data.federation;
			var hash = StellarSdk.hash(url);
			var sig = keys.sign(hash).toString('base64');

			return $http.post(url, {
				id:		signer,
				sig:	sig
			})
			.then(
				function (res) {
					Wallet.current.federation = $scope.data.federation;
					Storage.setItem('account.' + Wallet.current.alias, Wallet.current);
					$rootScope.goBack();
				},
				function (err) {
					console.log(err);
				}
			);
		});
	};
})
.directive('validFederation', function ($http, $q) {
	'use strict';

	return {
		require: 'ngModel',
		link: function(scope, element, attributes, ngModel) {
			ngModel.$asyncValidators.validFederation = function (name) {

				if (!name) {
					return $q.reject();
				}

				var url = 'https://getstargazer.com/api/federation';
				return $http.get(url, {
					params: {
						q: name + '*getstargazer.com',
						type: 'name'
					}
				})
				.then(
					function (res) {
						if (res.data.account_id !== attributes.accountid) {
							return $q.reject();
						}
					},
					function (err) {
						console.log(err);
					}
				);
			};
		}
	};
});
