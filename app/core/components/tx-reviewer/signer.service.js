/* global Promise */

import * as multisig from '@futuretense/stellar-multisig';
import horizon from '../../services/horizon';

export default /* @ngInject */ function (Keychain, Wallet) {

	return {
		addSignature,
		init,
		isApproved
	};

	async function init(context) {
		const server = horizon.getServer(context.network);
		const sourceAccounts = multisig.getTransactionSourceAccounts(context.tx);
		context.accounts = await getAccountInfo(server, sourceAccounts);

		const signers = multisig.getSigners(context.tx, context.accounts, 'ed25519_public_key');
		context.signers = Object.keys(signers.keys);

		context.networkId = horizon.getNetworkId(context.network);
		context.txHash = multisig.getTransactionHashRaw(context.tx, context.networkId);
		context.signatures = [];
	}

	function isApproved(context) {
		return multisig.isApproved(
			context.tx,
			context.networkId,
			context.accounts,
			context.tx.signatures
		);
	}

	function addSignature(context, sig) {
		context.tx.signatures.push(sig);
		context.signatures.push(sig);
	}

	async function getAccountInfo(horizon, sourceAccounts) {

		const loadAccount = (account) =>
			horizon.accounts()
			.accountId(account)
			.call()
			.catch(multisig.unregisteredAccount(account));

		const accountPromises = Array.from(sourceAccounts).map(source => {
			if (source in Wallet.accounts) {
				return Promise.resolve(Wallet.accounts[source]);
			} else {
				return loadAccount(source);
			}
		});

		return await Promise.all(accountPromises);
	}
}
