/* global angular, console, StellarSdk */

angular.module('app')
.controller('AddContactCtrl', function ($route, $scope, Contacts, DestinationCache, Horizon) {
	'use strict';

	$scope.cancel = function () {
		$scope.closeModalService();
	};

	$scope.networks = Horizon.getNetworks();

	$scope.model = {
		network: Horizon.livenet
	};

	$scope.saveContact = function () {

		DestinationCache.lookup($scope.model.address)
		.then(function (destInfo) {

			var contact = {
				id:			destInfo.account_id.trim(),
				network:	$scope.model.network
			};

			if ($scope.model.meta) {
				contact.meta = $scope.model.meta;
			}

			if ($scope.model.meta_type) {
				contact.meta_type = $scope.model.meta_type;
			}

			Contacts.add($scope.model.name, contact);
			$scope.closeModalService();
			$route.reload();
		});
	};
});

