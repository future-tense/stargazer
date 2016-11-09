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

		if ($scope.meta) {
			contact.meta = $scope.model.meta;
		}

		if ($scope.meta_type) {
			contact.meta_type = $scope.model.meta_type;
		}

		Contacts.add($scope.model.name, contact);
		$scope.closeModalService();
		$route.reload();
	};
});

