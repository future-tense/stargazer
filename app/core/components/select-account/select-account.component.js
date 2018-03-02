
import modalTemplate from './select-account.modal.html';

export default /* @ngInject */ class SelectAccountController {
	constructor(Modal) {
		this.Modal = Modal;
	}

	selectAccount() {
		const data = {
			network: this.network,
			filter: this.filter,
			bind: this.bind
		};

		this.Modal.show(modalTemplate, data)
		.then(dest => {
			this.destination = dest;
		});
	}
}

SelectAccountController.$inject = ['Modal'];
