/* global angular, console */

angular.module('app')
.factory('Submitter', function ($ionicLoading, $location, $q, $translate, Signer) {
	'use strict';

	return {
		submit: function (context) {

			//
			//	check if signature thresholds are met
			//

			if (Signer.hasEnoughSignatures(context.accounts)) {

				return $translate('default.submitting')
				.then(function (res) {
					$ionicLoading.show({
						template: res
					});

					return context.horizon.submitTransaction(context.tx)
					.then(function (res) {
						$ionicLoading.hide();
						return res;
					}, function (err) {
						$ionicLoading.hide();
						return $q.reject(err);
					});
				});
			} else {
				return $q.reject('Not enough signatures');
			}
		}

	};
});
