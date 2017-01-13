/* global angular, console, StellarSdk */

angular.module('app')
.controller('EditTransactionCommentCtrl', function ($scope, History, Storage, Wallet) {
	'use strict';

	$scope.cancel = function () {
		$scope.closeModalService();
	};

	$scope.buttonText = function() {
		return $scope.effect.comment? 'modal.comment.edit' : 'modal.comment.add';
	};

	$scope.saveComment = function () {
		$scope.closeModalService();

		if ($scope.model.comment) {
			$scope.effect.comment = $scope.model.comment;
		} else {
			delete $scope.effect.comment;
		}

		var accountName	= Wallet.current.alias;
		Storage.setItem('history.' + accountName, History.effects[accountName]);
	};
});

