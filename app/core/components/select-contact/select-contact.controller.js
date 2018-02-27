import contacts from '../../services/contacts';

export default class SelectContactController {
	constructor(Modal) {
		this.Modal = Modal;
	}

	hasContacts() {
		return contacts.forNetwork(this.network).length !== 0;
	}

	selectContact() {
		const data = {
			network: this.network,
			heading: 'Select Contact'
		};

		this.Modal.show('app/core/components/select-contact/select-contact.modal.html', data)
		.then(dest => {
			this.destination = dest;
		});
	}
}
