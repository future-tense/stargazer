/* global angular, console, StellarSdk */

angular.module('app')
.controller('AddContactCtrl', function ($route, $scope, Contacts) {
	'use strict';

	$scope.advanced = false;
	$scope.cancel = function () {
		$scope.closeModalService();
	};

	$scope.model = {};

	$scope.$watch('model.destInfo', function (destInfo) {
		if (destInfo && destInfo.id !== $scope.model.id && destInfo.memo_type !== '') {
			$scope.model.memo		= destInfo.memo;
			$scope.model.memo_type	= destInfo.memo_type;
		}
	});

	$scope.saveContact = function () {

		var contact = {
			id:			$scope.model.destInfo.id,
			network:	$scope.model.network
		};

		if ($scope.model.memo) {
			contact.memo = $scope.model.memo;
		}

		if ($scope.model.memo_type) {
			contact.memo_type = $scope.model.memo_type;
		}

		Contacts.add($scope.model.name, contact);
		$scope.closeModalService();
		$route.reload();
	};
});

