/* global */

function getItem(key) {
	const value = window.localStorage.getItem(key);
	if (value) {
		try {
			return JSON.parse(value);
		} catch (err) {
			return null;
		}
	} else {
		return null;
	}
}

function setItem(key, value) {
	window.localStorage.setItem(key, JSON.stringify(value, (key, value) => {
		if (key.slice(0, 2) === '$$') {
			return undefined;
		}

		return value;
	}));
}

function removeItem(key) {
	window.localStorage.removeItem(key);
}

const version = getItem('db-version');
if (!version) {
	setItem('db-version', 1);
}

export default {
	getItem: getItem,
	setItem: setItem,
	removeItem: removeItem
};

