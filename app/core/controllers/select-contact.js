/* global angular, console */

angular.module('app')
.controller('SelectContactCtrl', function ($scope, Contacts, Wallet) {
	'use strict';

	const network = $scope.data.network;

	$scope.cancel = cancel;
	$scope.select = select;

	$scope.accounts = getAccounts();
	$scope.contacts = Contacts.forNetwork(network);
	$scope.heading	= $scope.data.heading;

	function getAccounts() {
		return Wallet.accountList
		.filter(item => item.network === network)
		.map(item => item.alias);
	}

	function cancel() {
		$scope.closeModalService();
	}

	function select (contact) {
		$scope.modalResolve(contact);
	}
});
