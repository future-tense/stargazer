/* global angular, StellarSdk */

angular.module('app')
.factory('Keychain', function ($q, $rootScope, Crypto, Modal, Storage) {
	'use strict';

	var keychain = {};
	var keys = Storage.getItem('keys');
	if (keys) {
		keys.forEach(function (publicKey) {
			keychain[publicKey] = Storage.getItem('key.' + publicKey);
		});
	}

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

	function getKey(signer) {

		var keyStore = keychain[signer];
		if (typeof keyStore === 'string') {
			var keys =  StellarSdk.Keypair.fromSecret(keyStore);
			return $q.when(keys);
		}

		var scope = $rootScope.$new();
		scope.signer = signer;

		return Modal.show('app/core/modals/submit-password.html', scope)
		.then(function (password) {
			var secret = Crypto.decrypt(keyStore, password);
			return StellarSdk.Keypair.fromSecret(secret);
		});
	}

	/* */

	function addKey(accountId, seed) {
		keychain[accountId] = seed;
		Storage.setItem('key.' + accountId, seed);
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

	function isEncrypted (signer) {
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
			var seed = Crypto.decrypt(keyStore, password);
			return StellarSdk.StrKey.isValidEd25519SecretSeed(seed);
		} catch (error) {
			return false;
		}
	}

	function isValidPasswordForSigner(signer, password) {
		var keyStore = keychain[signer];
		return isValidPassword(keyStore, password);
	}

	function removePassword(signer, password) {
		var keyStore = keychain[signer];
		keyStore = Crypto.decrypt(keyStore, password);
		keychain[signer] = keyStore;
		Storage.setItem('key.' + signer, keyStore);
	}

	function setPassword(signer, password) {
		var keyStore = keychain[signer];
		keyStore = Crypto.encrypt(keyStore, password);
		keychain[signer] = keyStore;
		Storage.setItem('key.' + signer, keyStore);
	}

	function signMessage(signer, message) {
		return getKey(signer)
		.then(function (key) {
			var hash = StellarSdk.hash(StellarSdk.hash(message));
			return key.sign(hash).toString('base64');
		});
	}

	function signTransactionHash(signer, txHash) {
		return getKey(signer)
		.then(function (key) {
			return key.signDecorated(txHash);
		});
	}
});
