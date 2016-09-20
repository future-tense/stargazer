/* global angular */

angular.module('app')
.directive('walletFooter', function () {
	'use strict';

	return {
		restrict: 'AE',
		templateUrl: 'app/account/templates/wallet-footer.html'
	};
});
