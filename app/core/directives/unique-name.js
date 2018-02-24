/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';
import contacts from '../../core/services/contacts.js';

angular.module('app.directive.unique-name', [])
.directive('uniqueName', function (Wallet) {
	'use strict';

	function getNames() {
		const nameList = Wallet.accountList.map(account => account.alias);
		const contactList = contacts.getNames();
		return new Set([...nameList, ...contactList]);
	}

	return {
		require: 'ngModel',
		link: function (scope, element, attributes, ngModel) {
			ngModel.$validators.uniqueName = function (modelValue) {

				if ((attributes.uniqueName) &&
					(attributes.uniqueName === modelValue)) {
					return true;
				}
				return !getNames().has(modelValue);
			};
		}
	};

});
