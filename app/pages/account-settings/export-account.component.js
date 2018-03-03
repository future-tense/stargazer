
export default class ExportAccountController {

	/* @ngInject */
	constructor(Keychain, Wallet) {

		const account = Wallet.current;
		const key = Keychain.getKeyInfo(account.id);

		const stellar = {
			account: {
				network: account.network
			},
			key: key
		};

		this.text = JSON.stringify({
			stellar: stellar
		});

		this.key = key;
		this.isEncrypted = Keychain.isEncrypted(account.id);
	}
}
