
/* global angular */

angular.module('app')
.directive('accountBalance', function (Wallet) {
	'use strict';

	function link(scope, iElement, iAttrs) {

		scope.getAssets = function () {

			if (Wallet.current.balances) {
				return Wallet.current.balances.filter(function (e) {
					if (e.asset_type === 'native') {
						return true;
					} else {
						return (e.balance !== '0.0000000');
					}
				});
			} else {
				return [];
			}
		};
	}

	return {
		restrict: 'AE',
		scope: {
			account: '='
		},
		link: link,
		templateUrl: 'app/account/templates/account-balance.html'
	};
});
