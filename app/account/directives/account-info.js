
/* global angular, console */

angular.module('app')
.directive('accountInfo', function (Horizon, Wallet) {
	'use strict';

	function link(scope, element, attributes) {

		const account = Wallet.current;

		const network = account.network;
		if (network !== Horizon.public) {
			scope.network = Horizon.getNetwork(network).name;
		}

		scope.lockClass = account.isLocallySecure() ? 'icon-lock' : 'icon-lock-open';
	}

	return {
		restrict: 'AE',
		scope: {
		},
		link: link,
		templateUrl: 'app/account/templates/account-info.html'
	};
});
