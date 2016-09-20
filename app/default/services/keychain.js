/* global angular, console, sjcl, StellarSdk */

angular.module('app')
.factory('Keychain', function ($q, $rootScope, Storage) {
	'use strict';

	function encryptSeed(seed, key, cipherName, modeName) {
		var cipher = new sjcl.cipher[cipherName](key);
		var rawIV = sjcl.random.randomWords(3);
		var encryptedData = sjcl.mode[modeName].encrypt(
			cipher,
			sjcl.codec.utf8String.toBits(seed),
			rawIV
		);

		return [
			sjcl.codec.base64.fromBits(rawIV),
			sjcl.codec.base64.fromBits(encryptedData)
		];
	}

	function encrypt(seed, password) {

		var saltBits = sjcl.random.randomWords(4);		//	128 bits of salt, was 256 bits
		var numRounds = 4096;
		var key = sjcl.misc.pbkdf2(password, saltBits, numRounds);

		var salt = sjcl.codec.base64.fromBits(saltBits);

		var cipherName = 'aes';
		var modeName = 'gcm';

		var blob = encryptSeed(seed, key, cipherName, modeName);
		return ['1', salt, blob];
	}

	function decryptSeed(blob, key) {
		var cipherName = 'aes';
		var modeName = 'gcm';

		var cipher = new sjcl.cipher[cipherName](key);
		var rawIV = sjcl.codec.base64.toBits(blob[0]);
		var rawCipherText = sjcl.codec.base64.toBits(blob[1]);
		var decryptedData = sjcl.mode[modeName].decrypt(
			cipher,
			rawCipherText,
			rawIV
		);

		return sjcl.codec.utf8String.fromBits(decryptedData);
	}

	function decrypt(data, password) {
		var saltBits = sjcl.codec.base64.toBits(data[1]);
		var numRounds = 4096;
		var key = sjcl.misc.pbkdf2(password, saltBits, numRounds);
		return decryptSeed(data[2], key);
	}

	/* */

	var keychain = {};
	var keys = Storage.getItem('keys');
	if (keys) {
		keys.forEach(function (publicKey) {
			keychain[publicKey] = Storage.getItem('key.' + publicKey);
		});
	}

	/* */

	return {

		decrypt: decrypt,

		setPassword: function (signer, password) {
			var keyStore = keychain[signer];
			keyStore = encrypt(keyStore, password);
			keychain[signer] = keyStore;
			Storage.setItem('key.' + signer, keyStore);
		},

		removePassword: function (signer, password) {
			var keyStore = keychain[signer];
			console.log(keyStore);
			keyStore = decrypt(keyStore, password);
			console.log(keyStore);
			keychain[signer] = keyStore;
			Storage.setItem('key.' + signer, keyStore);
		},

		addKey: function (accountId, seed) {
			keychain[accountId] = seed;
			Storage.setItem('key.' + accountId, seed);
			Storage.setItem('keys', Object.keys(keychain));
		},

		getKeyInfo: function (signer) {
			return keychain[signer];
		},

		getKey: function (signer, keyStore) {

			if (!keyStore) {
				keyStore = keychain[signer];
			}

			if (typeof keyStore === 'string') {
				var keys =  StellarSdk.Keypair.fromSeed(keyStore);
				return $q.when(keys);
			}

			return $q(function(resolve, reject) {
				$rootScope.$emit('password.request', signer, function (err, password) {
					if (err) {
						reject(err);
					} else {
						var seed = decrypt(keyStore, password);
						resolve(StellarSdk.Keypair.fromSeed(seed));
					}
				});
			});

		},

		signsFor: function (signer) {
			return (signer in keychain);
		}
	};
});
