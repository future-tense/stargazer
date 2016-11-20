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
					.catch(function (err) {
						$ionicLoading.hide();
						$q.reject(err);
					})
					.then(function (res) {
						$ionicLoading.hide();
						return res;
					});
				});
			} else {
				$q.reject('Not enough signatures');
			}
		}

	};
});
