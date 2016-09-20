/* global angular, console */

angular.module('app')
.directive('walletHeader', function ($ionicSideMenuDelegate, $location, Wallet) {
	'use strict';

	function link(scope, element, attr) {
		scope.wallet = Wallet.current;

		scope.toggleLeftMenu = function() {
			$ionicSideMenuDelegate.toggleLeft();
		};

		scope.openSettings = function () {
			$location.path('/account-settings');
		};
	}

	return {
		restrict: 'AE',
		link: link,
		templateUrl: 'app/account/templates/wallet-header.html'
	};
});
