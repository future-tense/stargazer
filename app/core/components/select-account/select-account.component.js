
export default class SelectAccountController {
	constructor(Modal) {
		this.Modal = Modal;
	}

	selectAccount() {
		const data = {
			network: this.network,
			filter: this.filter,
			bind: this.bind
		};

		this.Modal.show('app/core/components/select-account/select-account.modal.html', data)
		.then(dest => {
			this.destination = dest;
		});
	}
}
