/* global angular, console, StellarSdk */

angular.module('app')
.controller('AddContactFromTxCtrl', function ($route, $scope, Contacts) {
	'use strict';

	$scope.cancel = function () {
		$scope.closeModalService();
	};

	$scope.saveContact = function () {

		var contact = {
			id:			$scope.model.id,
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

