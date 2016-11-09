/* global angular, console, StellarSdk */

angular.module('app')
.controller('EditContactCtrl', function ($rootScope, $routeParams, $scope, Contacts) {
	'use strict';

	var name = $routeParams.name;
	$scope.model = Contacts.get(name);
	$scope.model.name = name;

	$scope.updateContact = function () {

		Contacts.delete(name);

		name = $scope.model.name;
		var contact = $scope.model;
		delete contact.name;
		Contacts.add(name, contact);
		$rootScope.goBack();
	};

	$scope.deleteContact = function () {
		Contacts.delete($scope.model.name);
		$rootScope.goBack();
	};
});
