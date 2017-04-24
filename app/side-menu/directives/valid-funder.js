/* global angular */

angular.module('app')
.directive('validFunder', function (Wallet) {
	'use strict';

	return {
		require: 'ngModel',
		scope: {
			network: '='
		},
		link: function (scope, element, attributes, ngModel) {
			ngModel.$validators.validFunder = function (name) {

				if (!name) {
					return true;
				}

				const network = scope.network;
				const nameList = Wallet.accountList
				.filter(account => account.network === network)
				.map(account => account.alias);

				const names = new Set(nameList);
				return names.has(name);
			};
		}
	};
});
