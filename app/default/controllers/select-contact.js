/* global angular, console */

angular.module('app')
.controller('SelectContactCtrl', function($scope, Contacts, Wallet) {
	'use strict';

	$scope.accounts = Object.keys(Wallet.accounts)
	.filter(function (key) {
		return (Wallet.accounts[key].network === Wallet.current.network);
	})
	.map(function (key) {
		return Wallet.accounts[key].alias;
	});

	$scope.contacts = Contacts.forNetwork(Wallet.current.network);

	$scope.cancel = function () {
		$scope.modal.remove();
	};

	$scope.select = function (contact) {
		$scope.send.destination = contact;
		$scope.modal.remove();
	};
});
