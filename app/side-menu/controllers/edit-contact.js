/* global angular, console, StellarSdk */

angular.module('app')
.controller('EditContactCtrl', function ($rootScope, $routeParams, $scope, Contacts, Horizon) {
	'use strict';

	var name = $routeParams.name;
	var contact = Contacts.get(name);

	$scope.model = contact;
	$scope.model.name = name;
	$scope.model.network = Horizon.getNetwork(contact.network);
	$scope.networks = Horizon.getNetworks();

	$scope.updateContact = function () {

		Contacts.delete(name);

		name = $scope.model.name;
		var contact = $scope.model;
		delete contact.name;
		contact.network = contact.network.hash;
		Contacts.add(name, contact);
		$rootScope.goBack();
	};

	$scope.deleteContact = function () {
		Contacts.delete($scope.model.name);
		$rootScope.goBack();
	};
});
