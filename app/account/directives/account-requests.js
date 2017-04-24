/* global angular, console */

angular.module('app')
.directive('accountRequests', function ($q, Reviewer, Transactions, Wallet) {
	'use strict';

	return {
		restrict: 'E',
		link: link,
		templateUrl: 'app/account/templates/account-requests.html'
	};

	function link(scope, element, attributes) {
		scope.isSigned		= isSigned;
		scope.review		= reviewPending;
		scope.getRequests	= getRequests;
		scope.hasPending	= hasPending;
		scope.pubkey		= Wallet.current.id;
	}

	function getRequests(pubkey) {
		return Transactions.forSigner(pubkey);
	}

	function hasPending(pubkey) {
		return getRequests(pubkey).length !== 0;
	}

	function isSigned(tx, pubkey) {
		return (tx.hasSigned && pubkey in tx.hasSigned) ? 'Signed' : 'Unsigned';
	}

	function reviewPending(context) {
		$q.when(context)
		.then(Reviewer.review)
		.catch(() => {});
	}
});
