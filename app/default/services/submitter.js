/* global angular, console */

angular.module('app')
.factory('Submitter', function ($ionicLoading, $location, $q, Signer) {
	'use strict';

	return {
		submit: function (context) {

			//
			//	check if signature thresholds are met
			//

			if (Signer.hasEnoughSignatures(context.accounts)) {

				$ionicLoading.show({
					template: 'Submitting...'
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
			} else {
				$q.reject('Not enough signatures');
			}
		}

	};
});
