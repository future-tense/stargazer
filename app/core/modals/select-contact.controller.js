/* global angular, console */

import 'ionic-sdk/release/js/ionic.bundle';
import contacts from '../../core/services/contacts.js';

angular.module('app.modals.select-contact', [])
.controller('SelectContactCtrl', function ($scope) {
	'use strict';

	const network = $scope.data.network;

	$scope.cancel = cancel;
	$scope.select = select;

	$scope.contacts = contacts.forNetwork(network);
	$scope.heading	= $scope.data.heading;

	function cancel() {
		$scope.closeModalService();
	}

	function select(contact) {
		$scope.modalResolve(contact);
	}
});
