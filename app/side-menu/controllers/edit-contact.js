/* global angular, console, StellarSdk */

angular.module('app')
.controller('EditContactCtrl', function ($rootScope, $routeParams, $scope, Contacts) {
	'use strict';

	var name = $routeParams.name;
	var contact = Contacts.get(name);

	$scope.advanced = false;
	$scope.model = JSON.parse(JSON.stringify(contact));
	$scope.model.name = name;

	$scope.$watch('model.destInfo', function (destInfo) {
		if (destInfo && destInfo.id !== $scope.model.id && destInfo.memo_type !== '') {
			$scope.model.memo		= destInfo.memo;
			$scope.model.memo_type	= destInfo.memo_type;
		}
	});

	$scope.updateContact = function () {

		$scope.model.id = $scope.model.destInfo.id;
		delete $scope.model.destInfo;

		if ($scope.model.memo_type === '') {
			delete $scope.model.memo;
			delete $scope.model.memo_type;
		}

		Contacts.delete(name);
		name = $scope.model.name;
		contact = $scope.model;
		delete contact.name;
		Contacts.add(name, contact);
		$rootScope.goBack();
	};

	$scope.deleteContact = function () {
		Contacts.delete($scope.model.name);
		$rootScope.goBack();
	};
});
