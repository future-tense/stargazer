/* global angular, console, StellarSdk */

(function () {
	'use strict';

	angular.module('app')
	.controller('TransactionCtrl', function ($q, $route, $scope, Contacts, History, Modal, Wallet) {

		$scope.network  = Wallet.current.network;
		var accountName	= Wallet.current.alias;
		var effectId	= $route.current.params.id;

		var effect = History.effects[accountName][effectId];

		if (effect.type === 'account_created') {
			$scope.type = 'recv';
			$scope.code = 'XLM';
			$scope.amount = effect.amount;
			$scope.counterparty = effect.from;
			$scope.counterpartyLabel = 'From';
		}

		else if (effect.type === 'account_credited') {
			$scope.type = 'recv';
			$scope.code = effect.asset_code;
			$scope.amount = effect.amount;
			$scope.counterparty = effect.from;
			$scope.counterpartyLabel = 'From';
		}

		else if (effect.type === 'account_debited') {
			$scope.type = 'send';
			$scope.code = effect.asset_code;
			$scope.amount = effect.amount;
			$scope.counterparty = effect.to;
			$scope.counterpartyLabel = 'To';
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
			return effect.comment? 'Edit Comment' : 'Add Comment';
		};

		$scope.editComment = function () {

			$scope.model = {
				comment: effect.comment
			};

			Modal.show('app/account/views/edit-txcomment.html', $scope);
		};

		/* ADD CONTACT */

		$scope.isContact = ($scope.counterparty in Wallet.accounts) ||
			Contacts.lookup($scope.counterparty, Wallet.current.network);

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

			Modal.show('app/account/views/add-contact.html', $scope);
		};
	});
})();
