/* global angular, console */

angular.module('app')
.controller('AccountAdvancedCtrl', function ($scope, Reverse, Wallet) {
	'use strict';

	var inflationDest = Wallet.current.inflationDest;
	if (inflationDest) {
		Reverse.lookupAndFill(
			function (res) {$scope.inflationDest = res;},
			inflationDest
		);
	}
});
