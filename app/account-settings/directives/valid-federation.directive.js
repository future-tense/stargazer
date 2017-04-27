/* global angular */

angular.module('app')
.directive('validFederation', function ($http, $q) {
	'use strict';

	return {
		require: 'ngModel',
		link: function (scope, element, attributes, ngModel) {
			ngModel.$asyncValidators.validFederation = function (name) {

				if (!name) {
					return $q.reject();
				}

				const url = 'https://getstargazer.com/api/federation';
				return $http.get(url, {
					/* eslint-disable id-length */
					params: {
						q: `${name}*getstargazer.com`,
						type: 'name'
					}
					/* eslint-enable id-length */
				})
				.then(res => {
					if (res.data.account_id !== attributes.accountid) {
						return $q.reject();
					}
				})
				.catch(err => console.log(err));
			};
		}
	};
});
