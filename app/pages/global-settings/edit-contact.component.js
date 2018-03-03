
import contacts from '../../core/services/contacts.js';

export default class EditContactController {

	/* @ngInject */
	constructor($rootScope, $routeParams) {

		this.$rootScope = $rootScope;

		this.advanced	= false;
		this.minHeight	= getMinHeight();
		this.model		= initModel();
		this.oldName	= $routeParams.name;

		function getMinHeight() {
			const headerHeight = 40;
			const numButtons = 2;
			const buttonGroupHeight = 48 * numButtons + 8 * (numButtons - 1) + 24;
			return `${window.innerHeight - (buttonGroupHeight + headerHeight)}px`;
		}

		function initModel() {
			const name = $routeParams.name;
			const contact = contacts.get(name);
			const model = JSON.parse(JSON.stringify(contact));
			model.name = name;
			return model;
		}
	}

	deleteContact() {
		contacts.delete(this.model.name);
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

		contacts.delete(this.oldName);

		const name = this.model.name;
		const contact = this.model;
		delete contact.name;
		contacts.add(name, contact);
		this.$rootScope.goBack();
	}
}
