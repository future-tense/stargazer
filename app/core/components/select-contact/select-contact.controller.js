import contacts from '../../services/contacts';
import selectContactModal from './select-contact.modal.html';

export default class SelectContactController {

	/* @ngInject */
	constructor(Modal) {
		this.Modal = Modal;
	}

	hasContacts() {
		return contacts.forNetwork(this.network).length !== 0;
	}

	selectContact() {
		const data = {
			network: this.network,
			filter: this.filter,
			bind: this.bind
		};

		this.Modal.show(selectContactModal, data)
		.then(dest => {
			this.destination = dest;
		});
	}
}
