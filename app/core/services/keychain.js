/* global angular, StellarSdk */

angular.module('app')
.factory('Keychain', function ($q, Crypto, Modal, Storage) {
	'use strict';

	const keychain = {};
	const keys = Storage.getItem('keys') || [];
	keys.forEach(publicKey => {
		keychain[publicKey] = Storage.getItem(`key.${publicKey}`);
	});

	return {
		addKey: addKey,
		getKeyInfo: getKeyInfo,
		idFromKey: idFromKey,
		isEncrypted: isEncrypted,
		isLocalSigner: isLocalSigner,
		isValidPassword: isValidPassword,
		isValidPasswordForSigner: isValidPasswordForSigner,
		removePassword: removePassword,
		setPassword: setPassword,
		signMessage: signMessage,
		signTransactionHash: signTransactionHash
	};

	function getKey(signer, password) {

		/* has key gone missing from "keys"? */
		if (!(signer in keychain)) {
			const key = Storage.getItem(`key.${signer}`);
			if (key) {
				keychain[signer] = key;
				Storage.setItem('keys', Object.keys(keychain));
			}
		}

		const keyStore = keychain[signer];
		if (typeof keyStore === 'string') {
			const keys =  StellarSdk.Keypair.fromSecret(keyStore);
			return $q.when(keys);
		}

		if (password) {
			const key = decryptKey(password);
			return $q.when(key);
		}

		const data = {
			signer: signer
		};

		return Modal.show('app/core/modals/submit-password.html', data)
		.then(password => decryptKey(password));

		function decryptKey(password) {
			const secret = Crypto.decrypt(keyStore, password);
			return StellarSdk.Keypair.fromSecret(secret);
		}
	}

	/* */

	function addKey(accountId, seed) {
		keychain[accountId] = seed;
		Storage.setItem(`key.${accountId}`, seed);
		Storage.setItem('keys', Object.keys(keychain));
	}

	function getKeyInfo(signer) {
		return keychain[signer];
	}

	function idFromKey(key, password) {
		if (typeof key === 'object') {
			key = Crypto.decrypt(key, password);
		}
		return StellarSdk.Keypair.fromSecret(key).publicKey();
	}

	function isEncrypted(signer) {
		return (typeof keychain[signer] === 'object');
	}

	function isLocalSigner(signer) {
		return (signer in keychain);
	}

	function isValidPassword(keyStore, password) {
		if (typeof keyStore === 'string') {
			return true;
		}

		try {
			const seed = Crypto.decrypt(keyStore, password);
			return StellarSdk.StrKey.isValidEd25519SecretSeed(seed);
		} catch (error) {
			return false;
		}
	}

	function isValidPasswordForSigner(signer, password) {
		const keyStore = keychain[signer];
		return isValidPassword(keyStore, password);
	}

	function removePassword(signer, password) {
		let keyStore = keychain[signer];
		keyStore = Crypto.decrypt(keyStore, password);
		keychain[signer] = keyStore;
		Storage.setItem(`key.${signer}`, keyStore);
	}

	function setPassword(signer, password) {
		let keyStore = keychain[signer];
		keyStore = Crypto.encrypt(keyStore, password);
		keychain[signer] = keyStore;
		Storage.setItem(`key.${signer}`, keyStore);
	}

	function signMessage(signer, message) {
		const hash = StellarSdk.hash(StellarSdk.hash(message));
		return getKey(signer)
		.then(key => key.sign(hash).toString('base64'));
	}

	function signTransactionHash(signer, hash, password) {
		return getKey(signer, password)
		.then(key => key.signDecorated(hash));
	}
});
