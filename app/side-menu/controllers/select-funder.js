/* global angular */

angular.module('app')
.controller('SelectFundingAccountCtrl', function ($scope, Wallet) {
	'use strict';

	$scope.cancel = cancel;
	$scope.select = select;

	$scope.accounts = getAccounts();

	function getAccounts() {
		const network = $scope.data.network;
		const minimum = $scope.data.minimum;

		return Wallet.accountList
		.filter(item => item.network === network)
		.filter(item => item.canSend(minimum, 1))
		.map(item => item.alias);
	}

	function cancel() {
		$scope.closeModalService();
	}

	function select(contact) {
		$scope.modalResolve(contact);
	}
});

