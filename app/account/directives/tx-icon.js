/* global angular  */

angular.module('app')
.directive('txIcon', function () {
	'use strict';

	function link(scope, element, attrs) {

		var tx = scope.tx;
		if (tx.type === 'account_debited') {
			scope.type = 'send';
		}
		else if (tx.type === 'account_credited') {
			scope.type = 'recv';
		}
		else if (tx.type === 'account_created') {
			scope.type = 'recv';
		}
		else if (tx.type === 'trade') {
			scope.type = 'trade';
		}
	}

 	return {
		restrict: 'E',
		scope: {
			tx: '='
		},
		link: link,
		templateUrl: 'app/account/templates/tx-icon.html'
	};
});
