/* global angular, StellarSdk */

angular.module('app')
.factory('Modal', function ($ionicModal, $q, $rootScope) {
	'use strict';

	return {
		show: function (template, $scope) {
			$scope = $scope || $rootScope.$new();

			var deferred = $q.defer();
			$scope.modalResolve = function (res) {
				$scope.modal.remove();
				deferred.resolve(res);
			};

			$scope.modalReject = function (err) {
				$scope.modal.remove();
				deferred.reject(err);
			};

			$scope.closeModalService = function() {
				$scope.modalReject();
			};

			$ionicModal.fromTemplateUrl(template, {
				scope: $scope,
				animation: 'slide-in-up'
			})
			.then(function (modal) {
				$scope.modal = modal;
				modal.show();
			});

			return deferred.promise;
		}
	};
});
