/* global angular, console, StellarSdk */

angular.module('app')
.controller('ContactListCtrl', function ($route, $scope, Contacts, Modal) {
	'use strict';

	$scope.names = Contacts.getNames();

	$scope.addContact = function () {
		Modal.show('app/side-menu/views/modals/add-contact.html', $scope);
	};
/*
		$ionicModal.fromTemplateUrl('app/side-menu/views/modals/add-contact.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.modal = modal;
			$scope.modal.show();
		});
 */

});

