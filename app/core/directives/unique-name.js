/* global angular, StellarSdk */

angular.module('app')
.directive('uniqueName', function (Contacts, Wallet) {
	'use strict';

	const names = getNames();

	function getNames() {
		const nameList = Wallet.accountList.map(account => account.alias);
		const contacts = Contacts.getNames();
		return new Set([...nameList, ...contacts]);
	}

	return {
		require: 'ngModel',
		link: function (scope, element, attributes, ngModel) {
			ngModel.$validators.uniqueName = function (modelValue) {

				if ((attributes.uniqueName) &&
					(attributes.uniqueName === modelValue)) {
					return true
				}
				return !names.has(modelValue);
			};
		}
	};

});
