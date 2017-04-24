/* global angular, console */

angular.module('app')
.controller('AccountAdvancedCtrl', function ($scope, Reverse, Wallet) {
	'use strict';

	const inflationDest = Wallet.current.inflationDest;
	if (inflationDest) {
		Reverse.lookupAndFill(
			res => {$scope.inflationDest = res;},
			inflationDest
		);
	}
});
