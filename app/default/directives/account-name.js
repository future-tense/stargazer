
/* global angular, console, StellarSdk */

angular.module('app')
.directive('accountName', function ($q, Reverse) {
	'use strict';

	function link(scope, element, attrs) {

		var accountId	= scope.id;

		scope.name = accountId;
		Reverse.lookup(accountId, scope.network)
		.then(function (res) {
			scope.name = res;
		});
	}

	return {
		restrict: 'E',
		scope: {
			id: '@',
			network: '@'
		},
		link: link,
		template: '{{name}}'
	};
});
