/* global angular */

angular.module('app')
.factory('Storage', function ($window) {
	'use strict';

	function getItem(key) {
		var value = $window.localStorage.getItem(key);
		if (value) {
			return JSON.parse(value);
		} else {
			return null;
		}
	}

	function setItem(key, value) {
		$window.localStorage.setItem(key, JSON.stringify(value, function (key, value) {
			if (key.slice(0, 2) === '$$') {
				return undefined;
			}

			return value;
		}));
	}

	function removeItem(key) {
		$window.localStorage.removeItem(key);
	}

	var version = getItem('db-version');
	if (!version) {
		setItem('db-version', 1);
	}

	return {
		getItem: getItem,
		setItem: setItem,
		removeItem: removeItem
	};
});
