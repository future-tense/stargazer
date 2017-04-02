/* global angular, console, StellarSdk */

angular.module('app')
.controller('EditContactCtrl', function ($rootScope, $routeParams, $scope, Contacts) {
	'use strict';

	$scope.deleteContact = deleteContact;
	$scope.updateContact = updateContact;

	$scope.advanced		= false;
	$scope.minHeight	= getMinHeight();
	$scope.model		= initModel();

	$scope.$watch('model.destInfo', onDestInfo);

	function deleteContact() {
		Contacts.delete($scope.model.name);
		$rootScope.goBack();
	}

	function getMinHeight() {
		var headerHeight = 40;
		var numButtons = 2;
		var buttonGroupHeight = 48*numButtons + 8*(numButtons - 1) + 24;
		return window.innerHeight - (buttonGroupHeight + headerHeight) + 'px';
	}

	function initModel() {
		var name = $routeParams.name;
		var contact = Contacts.get(name);
		var model = JSON.parse(JSON.stringify(contact));
		model.name = name;
		return model;
	}

	function onDestInfo(destInfo) {
		if (destInfo && destInfo.id !== $scope.model.id && destInfo.memo_type !== '') {
			$scope.model.memo		= destInfo.memo;
			$scope.model.memo_type	= destInfo.memo_type;
		}
	}

	function updateContact() {
		$scope.model.id = $scope.model.destInfo.id;
		delete $scope.model.destInfo;

		if ($scope.model.memo_type === '') {
			delete $scope.model.memo;
			delete $scope.model.memo_type;
		}

		var oldName = $routeParams.name;
		Contacts.delete(oldName);

		var name = $scope.model.name;
		var contact = $scope.model;
		delete contact.name;
		Contacts.add(name, contact);
		$rootScope.goBack();
	}
});
