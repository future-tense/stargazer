/* global angular, console */

angular.module('app')
.controller('AccountAliasCtrl', function ($rootScope, $scope, Wallet) {
	'use strict';

	$scope.oldName = Wallet.current.alias;
	$scope.newName = $scope.oldName;

	$scope.save = function () {
		Wallet.renameAccount(Wallet.current, $scope.newName);
		$rootScope.goBack();
	};
});
