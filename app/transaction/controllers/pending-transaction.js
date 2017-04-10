/* global angular, console, StellarSdk */

angular.module('app')
.controller('PendingTransactionCtrl', function ($location, $q, $routeParams, $scope, Signer, Submitter, Transactions, Wallet) {
	'use strict';

	$scope.submit = submit;
	$scope.txHash = $routeParams.txHash;

	function submit() {

		var context = Transactions.get($scope.txHash);

		$q.when(context)
		.then(Signer.sign)
		.then(Submitter.submit)
		.then(function () {
			$location.path('/');
		})
		.catch(function (){});
	}
});

