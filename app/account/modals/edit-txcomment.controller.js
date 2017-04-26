/* global angular, console, StellarSdk */

angular.module('app')
.controller('EditTransactionCommentCtrl', function ($scope, History, Storage, Wallet) {
	'use strict';

	$scope.cancel = cancel;
	$scope.buttonText = buttonText;
	$scope.saveComment = saveComment;

	$scope.model = {};
	$scope.model.comment = $scope.data.comment;

	function buttonText() {
		return $scope.data.comment ? 'modal.comment.edit' : 'modal.comment.add';
	}

	function cancel() {
		$scope.closeModalService();
	}

	function saveComment() {
		$scope.closeModalService();

		if ($scope.model.comment) {
			$scope.data.comment = $scope.model.comment;
		} else {
			delete $scope.data.comment;
		}

		const accountName = Wallet.current.alias;
		Storage.setItem(`history.${accountName}`, History.effects[accountName]);
	}
});

