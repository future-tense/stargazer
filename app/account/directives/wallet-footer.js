/* global angular, console */

angular.module('app')
.directive('walletFooter', function (Wallet) {
	'use strict';

	function link(scope, element, attr) {
		scope.canSend = function () {
			return Wallet.current.canSend(0, 1);
		};
	}
	return {
		link: link,
		restrict: 'AE',
		templateUrl: 'app/account/templates/wallet-footer.html'
	};
});
