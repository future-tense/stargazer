/* global angular, console, StellarSdk */


(function () {
	'use strict';

	class EditContactController {

		constructor($rootScope, $routeParams, Contacts) {

			this.$rootScope = $rootScope;
			this.$routeParams = $routeParams;
			this.Contacts = Contacts;

			this.advanced		= false;
			this.minHeight	= getMinHeight();
			this.model		= initModel();

			function getMinHeight() {
				const headerHeight = 40;
				const numButtons = 2;
				const buttonGroupHeight = 48 * numButtons + 8 * (numButtons - 1) + 24;
				return `${window.innerHeight - (buttonGroupHeight + headerHeight)}px`;
			}

			function initModel() {
				const name = $routeParams.name;
				const contact = Contacts.get(name);
				const model = JSON.parse(JSON.stringify(contact));
				model.name = name;
				return model;
			}
		}

		deleteContact() {
			this.Contacts.delete(this.model.name);
			this.$rootScope.goBack();
		}

		onValidAddress(destInfo) {
			if (destInfo && destInfo.id !== this.model.id && destInfo.memo_type !== '') {
				this.model.id = destInfo.id;
				/* eslint-disable camelcase */
				this.model.memo		= destInfo.memo;
				this.model.memo_type	= destInfo.memo_type;
				/* eslint-enable camelcase */
			}
		}

		updateContact() {
			if (this.model.memo_type === '') {
				delete this.model.memo;
				delete this.model.memo_type;
			}

			const oldName = this.$routeParams.name;
			this.Contacts.delete(oldName);

			const name = this.model.name;
			const contact = this.model;
			delete contact.name;
			this.Contacts.add(name, contact);
			this.$rootScope.goBack();
		}
	}

	angular.module('app')
	.component('editContact', {
		controller: EditContactController,
		controllerAs: 'vm',
		templateUrl: 'app/side-menu/components/edit-contact.html'
	});
}());
