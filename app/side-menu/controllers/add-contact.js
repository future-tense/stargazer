/* global angular, console, StellarSdk */

angular.module('app')
.controller('AddContactCtrl', function ($route, $scope, Contacts) {
	'use strict';

	$scope.cancel		= cancel;
	$scope.saveContact	= saveContact;

	$scope.advanced		= false;
	$scope.model		= {};

	$scope.$watch('model.destInfo', onDestInfo);

	function cancel() {
		$scope.closeModalService();
	}

	function onDestInfo(destInfo) {
		if (destInfo && destInfo.id !== $scope.model.id && destInfo.memo_type !== '') {
			/* eslint-disable camelcase */
			$scope.model.memo		= destInfo.memo;
			$scope.model.memo_type	= destInfo.memo_type;
			/* eslint-enable camelcase */
		}
	}

	function saveContact() {

		const contact = {
			id:			$scope.model.destInfo.id,
			network:	$scope.model.network
		};

		if ($scope.model.memo) {
			contact.memo = $scope.model.memo;
		}

		if ($scope.model.memo_type) {
			/* eslint-disable camelcase */
			contact.memo_type = $scope.model.memo_type;
			/* eslint-enable camelcase */
		}

		Contacts.add($scope.model.name, contact);
		$scope.closeModalService();
		$route.reload();
	}
});

