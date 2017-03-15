
/* global angular, console */

angular.module('app')
.directive('accountInfo', function (Horizon, Wallet) {
	'use strict';

	function link(scope, element, attributes) {

		var account = Wallet.current;

		var network = account.network;
		if (network !== Horizon.public) {
			scope.network = Horizon.getNetwork(network).name;
		}

		scope.lockClass = account.isLocallySecure()? 'ion-ios-locked-outline' : 'ion-ios-unlocked-outline';
	}

	return {
		restrict: 'AE',
		scope: {
		},
		link: link,
		templateUrl: 'app/account/templates/account-info.html'
	};
});
