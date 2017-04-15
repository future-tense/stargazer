/* global angular, console */

angular.module('app')
.controller('SelectContactCtrl', function ($scope, Contacts, Wallet) {
	'use strict';

	$scope.cancel = cancel;
	$scope.select = select;

	$scope.accounts = getAccounts();
	$scope.contacts = Contacts.forNetwork(Wallet.current.network);

	function getAccounts() {
		const network = Wallet.current.network;

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
