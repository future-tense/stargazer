/* global angular, console, StellarSdk */

angular.module('app')
.controller('TransactionCtrl', function ($routeParams, $scope, Contacts, History, Modal, Wallet) {
	'use strict';

	$scope.network  = Wallet.current.network;
	var accountName	= Wallet.current.alias;
	var effectId	= $routeParams.id;

	var effect = History.effects[accountName][effectId];

	if (effect.type === 'account_created') {
		$scope.type = 'recv';
		$scope.code = 'XLM';
		$scope.amount = effect.amount;
		$scope.counterparty = effect.from;
		$scope.counterpartyLabel = 'account.transaction.from';
	}

	else if (effect.type === 'account_credited') {
		$scope.type = 'recv';
		$scope.code = effect.asset_code;
		$scope.amount = effect.amount;
		$scope.counterparty = effect.from;
		$scope.counterpartyLabel = 'account.transaction.from';
	}

	else if (effect.type === 'account_debited') {
		$scope.type = 'send';
		$scope.code = effect.asset_code;
		$scope.amount = effect.amount;
		$scope.counterparty = effect.to;
		$scope.counterpartyLabel = 'account.transaction.to';
	}

	else if (effect.type === 'trade') {
		$scope.type = 'trade';
		$scope.bought_amount = effect.bought_amount;
		$scope.bought_code = (effect.bought_asset_type === 'native')? 'XLM': effect.bought_asset_code;
		$scope.sold_amount = effect.sold_amount;
		$scope.sold_code = (effect.sold_asset_type === 'native')? 'XLM': effect.sold_asset_code;
	}

	$scope.effect = effect;
	$scope.buttonText = function() {
		return effect.comment? 'account.transaction.comment.edit' : 'account.transaction.comment.add';
	};

	$scope.isContact = ($scope.counterparty in Wallet.accounts) ||
		Contacts.lookup($scope.counterparty, Wallet.current.network);

	$scope.editComment = function () {

		$scope.model = {
			comment: effect.comment
		};

		Modal.show('app/account/modals/edit-txcomment.html', $scope);
	};

	$scope.addContact = function () {

		$scope.model = {
			id:			$scope.counterparty,
			network:	Wallet.current.network
		};

		if ($scope.type === 'send') {
			Wallet.current.horizon().transactions().transaction(effect.hash).call()
			.then(function (res) {
				if (res.operation_count === 1) {
					$scope.model.meta		= res.meta;
					$scope.model.meta_type	= res.meta_type;
				}
			});
		}

		Modal.show('app/account/modals/add-contact.html', $scope);
	};
});
