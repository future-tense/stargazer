/* global angular, console, StellarSdk */

angular.module('app')
.controller('ContactListCtrl', function ($scope, Contacts, Modal) {
	'use strict';

	$scope.addContact	= addContact;
	$scope.names		= Contacts.getNames();
	$scope.minHeight	= getMinHeight();

	function addContact() {
		Modal.show('app/side-menu/modals/add-contact.html');
	}

	function getMinHeight() {
		const headerHeight = 40;
		const buttonGroupHeight = 48 + 16 + 8;
		return `${window.innerHeight - (buttonGroupHeight + headerHeight)}px`;
	}
});

