
import contacts from '../../core/services/contacts.js';
import addContactModal from './add-contact.html';

export default class ContactListController {

	/* @ngInject */
	constructor(Modal) {
		this.Modal = Modal;

		this.names		= contacts.getNames();
		this.minHeight	= this.getMinHeight();
	}

	addContact(data) {
		this.Modal.show(addContactModal, data);
	}

	getMinHeight() {
		const headerHeight = 40;
		const buttonGroupHeight = 48 + 16 + 8;
		return `${window.innerHeight - (buttonGroupHeight + headerHeight)}px`;
	}
}


