/* global angular, console, StellarSdk */

(function () {
	'use strict';

	angular.module('app')
	.controller('TransactionCtrl', function ($ionicModal, $q, $route, $scope, Contacts, History, Storage, Wallet) {

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

		$scope.cancelComment = function () {
			$scope.modal.remove();
		};

		$scope.saveComment = function (comment) {
			$scope.modal.remove();
			effect.comment = comment;
			Storage.setItem('history.' + accountName, History.effects[accountName]);
		};

		$scope.editComment = function () {

			$ionicModal.fromTemplateUrl('app/account/views/tx-comment.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function (modal) {
				$scope.modal = modal;
				$scope.modal.comment = effect.comment;
				$scope.modal.show();
			});
		};

		/* ADD CONTACT */

		if ($scope.counterparty in Wallet.accounts) {
			$scope.isContact = true;
		}

		if (Contacts.lookup($scope.counterparty, Wallet.current.network)) {
			$scope.isContact = true;
		}

		$scope.saveContact = function (name) {
			Contacts.add(name, $scope.counterparty, Wallet.current.network);
			$scope.modal.remove();
			$route.reload();
		};

		$scope.addContact = function () {
			$ionicModal.fromTemplateUrl('app/account/views/add-contact.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function (modal) {
				$scope.modal = modal;
				$scope.modal.show();
			});
		};
	});
})();
