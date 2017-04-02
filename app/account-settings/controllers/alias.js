/* global angular, console */

angular.module('app')
.controller('AccountAliasCtrl', function ($rootScope, $scope, Wallet) {
	'use strict';

	$scope.save = save;

	$scope.data = {};
	$scope.data.newName = Wallet.current.alias;
	$scope.oldName = Wallet.current.alias;

	function save() {
		Wallet.renameAccount(Wallet.current, $scope.data.newName);
		$rootScope.goBack();
	}
});
