/* global angular, console, StellarSdk */

angular.module('app')
.controller('EditContactCtrl', function ($rootScope, $routeParams, $scope, Contacts, Horizon) {
	'use strict';

	var name = $routeParams.name;
	var contact = Contacts.get(name);

	$scope.memoTypes = [
		{name: 'memotype.none',		value: null},
		{name: 'memotype.id',		value: 'id'},
		{name: 'memotype.text',		value: 'text'},
		{name: 'memotype.hash',		value: 'hash'},
		{name: 'memotype.return',	value: 'return'}
	];

	$scope.advanced = false;
	$scope.model = contact;
	$scope.model.name = name;
	$scope.model.network = Horizon.getNetwork(contact.network);
	$scope.networks = Horizon.getNetworks();

	$scope.updateContact = function () {

		Contacts.delete(name);
		name = $scope.model.name;
		contact = $scope.model;
		delete contact.name;
		contact.network = Horizon.getHash(contact.network.phrase);
		Contacts.add(name, contact);
		$rootScope.goBack();
	};

	$scope.deleteContact = function () {
		Contacts.delete($scope.model.name);
		$rootScope.goBack();
	};
});
