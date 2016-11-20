/* global angular, console, StellarSdk */

angular.module('app')
.controller('ContactListCtrl', function ($route, $scope, Contacts, Modal) {
	'use strict';

	$scope.names = Contacts.getNames();

	$scope.addContact = function () {
		Modal.show('app/side-menu/modals/add-contact.html', $scope);
	};
});

