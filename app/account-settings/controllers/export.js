/* global angular, console */

angular.module('app')
.controller('ExportAccountCtrl', function ($scope, Horizon, Keychain, Wallet) {
	'use strict';

	var stellar = {
		account: {
			network: Wallet.current.network
		}
	};

	stellar.key = Keychain.getKeyInfo(Wallet.current.id);

	$scope.text = JSON.stringify({
		stellar: stellar
	});
});
