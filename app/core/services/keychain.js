/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';
import StellarSdk from 'stellar-sdk';
import crypto from './crypto.js';
import storage from '../../core/services/storage.js';

angular.module('app.service.keychain', [])
.factory('Keychain', function ($q, Modal) {
	'use strict';

	const keychain = {};
	const keys = storage.getItem('keys') || [];
	keys.forEach(publicKey => {
		keychain[publicKey] = storage.getItem(`key.${publicKey}`);
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
			const key = storage.getItem(`key.${signer}`);
			if (key) {
				keychain[signer] = key;
				storage.setItem('keys', Object.keys(keychain));
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
			const secret = crypto.decrypt(keyStore, password);
			return StellarSdk.Keypair.fromSecret(secret);
		}
	}

	/* */

	function addKey(accountId, seed) {
		keychain[accountId] = seed;
		storage.setItem(`key.${accountId}`, seed);
		storage.setItem('keys', Object.keys(keychain));
	}

	function getKeyInfo(signer) {
		return (signer in keychain) ? keychain[signer] : storage.getItem(`key.${signer}`);
	}

	function idFromKey(key, password) {
		if (typeof key === 'object') {
			key = crypto.decrypt(key, password);
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
			const seed = crypto.decrypt(keyStore, password);
			return StellarSdk.StrKey.isValidEd25519SecretSeed(seed);
		} catch (error) {
			return false;
		}
	}

	function isValidPasswordForSigner(signer, password) {
		const keyStore = (signer in keychain) ? keychain[signer] : storage.getItem(`key.${signer}`);
		return isValidPassword(keyStore, password);
	}

	function removePassword(signer, password) {
		const cypher = (signer in keychain) ? keychain[signer] : storage.getItem(`key.${signer}`);
		const plain  = crypto.decrypt(cypher, password);
		keychain[signer] = plain;
		storage.setItem(`key.${signer}`, plain);
		storage.setItem('keys', Object.keys(keychain));
	}

	function setPassword(signer, password) {
		const plain = (signer in keychain) ? keychain[signer] : storage.getItem(`key.${signer}`);
		const cypher  = crypto.encrypt(plain, password);
		keychain[signer] = cypher;
		storage.setItem(`key.${signer}`, cypher);
		storage.setItem('keys', Object.keys(keychain));
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
