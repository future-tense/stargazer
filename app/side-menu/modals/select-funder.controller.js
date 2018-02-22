/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

angular.module('app.modal.select-funder', [])
.controller('SelectFundingAccountCtrl', function ($scope, Wallet) {
	'use strict';

	$scope.cancel = cancel;
	$scope.select = select;

	$scope.accounts = getAccounts();

	function getAccounts() {
		const network = $scope.data.network;
		const minimum = $scope.data.minimum || 20;
		const numOps  = $scope.data.numOps || 1;

		return Wallet.accountList
		.filter(item => item.network === network)
		.filter(item => item.canSend(minimum, numOps))
		.map(item => item.alias);
	}

	function cancel() {
		$scope.closeModalService();
	}

	function select(contact) {
		$scope.modalResolve(contact);
	}
});

