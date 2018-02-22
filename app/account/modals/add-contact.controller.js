/* global angular, console */

import 'ionic-sdk/release/js/ionic.bundle';
import contacts from '../../core/services/contacts.js';

angular.module('app.modal.add-contact-from-tx', [])
.controller('AddContactFromTxCtrl', function ($route, $scope) {
	'use strict';

	$scope.cancel		= cancel;
	$scope.saveContact	= saveContact;

	$scope.model		= $scope.data;

	function cancel() {
		$scope.closeModalService();
	}

	function saveContact() {

		const contact = {
			id:			$scope.model.id,
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

		contacts.add($scope.model.name, contact);
		$scope.closeModalService();
		$route.reload();
	}
});

