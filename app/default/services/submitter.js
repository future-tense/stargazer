/* global angular, console */

angular.module('app')
.factory('Submitter', function ($rootScope, $ionicLoading, $location, $q, $translate, Signer) {
	'use strict';

	function submit(context) {

		if (Signer.hasEnoughSignatures(context.accounts)) {

			return $translate('transaction.submitting')
			.then(function (res) {
				$ionicLoading.show({
					template: res
				});

				return context.horizon.submitTransaction(context.tx)
				.then(
					function (res) {
						$ionicLoading.hide();
						return res;
					},
					function (err) {
						$ionicLoading.hide();

						var res = '';
						if (err.title === 'Transaction Failed') {
							res = 'error.transaction-failed';
						}
						$rootScope.$emit('$submitter.failed', res);
						return $q.reject();
					}
				);
			});
		}

		else {
			var res = 'error.missing-signatures';
			$rootScope.$emit('$submitter.failed', res);
			return $q.reject();
		}
	}

	return {
		submit: submit
	};
});
