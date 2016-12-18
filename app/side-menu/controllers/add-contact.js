/* global angular, console, StellarSdk */

angular.module('app')
.controller('AddContactCtrl', function ($route, $scope, Contacts, DestinationCache, Horizon) {
	'use strict';

	$scope.advanced = false;
	$scope.cancel = function () {
		$scope.closeModalService();
	};

	$scope.networks = Horizon.getNetworks();

	$scope.model = {
		network: Horizon.getNetwork(Horizon.livenet)
	};

	$scope.saveContact = function () {

		DestinationCache.lookup($scope.model.address)
		.then(function (destInfo) {

			var contact = {
				id:			destInfo.id,
				network:	Horizon.getHash($scope.model.network.phrase)
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
		});
	};
});

