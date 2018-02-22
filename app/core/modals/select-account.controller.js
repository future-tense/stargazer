/* global angular, console */

import 'ionic-sdk/release/js/ionic.bundle';

angular.module('app.modals.select-account', [])
.controller('SelectAccountCtrl', function ($scope, Wallet) {
	'use strict';

	const network = $scope.data.network;

	$scope.cancel = cancel;
	$scope.select = select;

	$scope.accounts = getAccounts();
	$scope.heading	= $scope.data.heading;

	function getAccounts() {
		return Wallet.accountList
		.filter(item => item.network === network)
		.map(item => item.alias);
	}

	function cancel() {
		$scope.closeModalService();
	}

	function select(contact) {
		$scope.modalResolve(contact);
	}
});
