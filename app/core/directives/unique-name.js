/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

angular.module('app.directive.unique-name', [])
.directive('uniqueName', function (Contacts, Wallet) {
	'use strict';

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
				return !getNames().has(modelValue);
			};
		}
	};

});
