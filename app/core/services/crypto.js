
import sjcl from 'sjcl';

const encryptSeed = (seed, key, cipherName, modeName) => {
	const cipher = new sjcl.cipher[cipherName](key);
	const rawIV = sjcl.random.randomWords(3);
	const encryptedData = sjcl.mode[modeName].encrypt(
		cipher,
		sjcl.codec.utf8String.toBits(seed),
		rawIV
	);

	return [
		sjcl.codec.base64.fromBits(rawIV),
		sjcl.codec.base64.fromBits(encryptedData)
	];
};

const encrypt = (seed, password) => {

	const saltBits = sjcl.random.randomWords(4);		//	128 bits of salt, was 256 bits
	const numRounds = 4096;
	const key = sjcl.misc.pbkdf2(password, saltBits, numRounds);

	const salt = sjcl.codec.base64.fromBits(saltBits);

	const cipherName = 'aes';
	const modeName = 'gcm';

	const blob = encryptSeed(seed, key, cipherName, modeName);
	return ['1', salt, blob];
};

const decryptSeed = (blob, key) => {
	const cipherName = 'aes';
	const modeName = 'gcm';

	const cipher = new sjcl.cipher[cipherName](key);
	const rawIV = sjcl.codec.base64.toBits(blob[0]);
	const rawCipherText = sjcl.codec.base64.toBits(blob[1]);
	const decryptedData = sjcl.mode[modeName].decrypt(
		cipher,
		rawCipherText,
		rawIV
	);

	return sjcl.codec.utf8String.fromBits(decryptedData);
};

const decrypt = (data, password) => {
	const saltBits = sjcl.codec.base64.toBits(data[1]);
	const numRounds = 4096;
	const key = sjcl.misc.pbkdf2(password, saltBits, numRounds);
	return decryptSeed(data[2], key);
};

export default {
	encrypt: encrypt,
	decrypt: decrypt
};
