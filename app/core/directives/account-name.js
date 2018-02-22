/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

angular.module('app.directive.account-name', [])
.directive('accountName', function (Reverse) {
	'use strict';

	function link(scope, element, attributes) {

		scope.$watch('id', () => {

			if (scope.id === undefined) {
				return;
			}

			const network = scope.network || scope.$parent.network;
			Reverse.lookupAndFill(
				res => {
					if (res === scope.id) {
						res = `${res.slice(0, 4)}....${res.slice(-4)}`;
 					}
					element[0].innerText = res;
				},
				scope.id,
				network,
				scope.tx
			);
		});
	}

	return {
		restrict: 'E',
		scope: {
			id: '@',
			network: '@',
			tx: '='
		},
		link: link
	};
});
