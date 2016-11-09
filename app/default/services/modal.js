/* global angular, StellarSdk */

angular.module('app')
.factory('Modal', function ($ionicModal, $rootScope) {
	'use strict';

	return {
		show: function (template, $scope) {
			$scope = $scope || $rootScope.$new();

			$scope.closeModalService = function() {
				$scope.modal.remove();
			};

			return $ionicModal.fromTemplateUrl(template, {
				scope: $scope,
				animation: 'slide-in-up'
			})
			.then(function (modal) {
				$scope.modal = modal;
				modal.show();
			});
		}
	};
});
