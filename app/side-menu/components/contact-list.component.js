/* global angular, console, StellarSdk */


(function () {
	'use strict';

	class ContactListController {
		constructor($window, Contacts, Modal) {
			this.$window = $window;
			this.Modal = Modal;

			this.names		= Contacts.getNames();
			this.minHeight	= this.getMinHeight();
		}

		addContact() {
			this.Modal.show('app/side-menu/modals/add-contact.html');
		}

		getMinHeight() {
			const headerHeight = 40;
			const buttonGroupHeight = 48 + 16 + 8;
			return `${this.$window.innerHeight - (buttonGroupHeight + headerHeight)}px`;
		}
	}

	angular.module('app')
	.component('contactList', {
		controller: ContactListController,
		controllerAs: 'vm',
		templateUrl: 'app/side-menu/components/contact-list.html'
	});
}());
