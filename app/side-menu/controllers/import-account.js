/* global angular, console, StellarSdk */

angular.module('app')
.controller('ImportAccountCtrl', function ($location, $routeParams, $scope, $translate, Keychain, Wallet) {
	'use strict';

	$scope.import = importAccount;

	$scope.account = {};
	$scope.advanced = false;
	$scope.minHeight = getMinHeight();

	activate();

	function activate() {
		if ($routeParams.data) {
			var data = JSON.parse(window.atob($routeParams.data));
			$scope.encrypted = (typeof data.key === 'object');
			$scope.scanned = true;
			$scope.account.seed = data.key;
			$scope.account.network = data.account.network;
		}

		var numAccounts = Object.keys(Wallet.accounts).length;
		$scope.account.alias = $translate.instant('account.defaultname', {number: numAccounts + 1});
	}

	function getMinHeight() {
		var headerHeight = 40;
		var buttonGroupHeight = 48 + 16 + 8;
		return window.innerHeight - (buttonGroupHeight + headerHeight) + 'px';
	}

	function importAccount() {
		var keyStore  = $scope.account.seed;
		var accountId = Keychain.idFromKey(keyStore, $scope.account.password);
		Wallet.importAccount(accountId, keyStore, $scope.account.alias, $scope.account.network);
		$location.path('/');
	}
})

.directive('validPassword2', function (Keychain) {
	'use strict';

	return {
		require: 'ngModel',
		link: function (scope, element, attributes, ngModel) {

			ngModel.$validators.validPassword = function (modelValue) {
				if (modelValue) {
					return Keychain.isValidPassword(scope.$parent.account.seed, modelValue);
				} else {
					return false;
				}
			};
		}
	};

});
