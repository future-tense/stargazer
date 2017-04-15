/* global angular, StellarSdk */

angular.module('app')
.factory('Modal', function ($ionicModal, $q, $rootScope) {
	'use strict';

	return {
		show: show
	};

	function show(template, data) {

		const $scope = $rootScope.$new();

		$scope.closeModalService	= close;
		$scope.modalReject			= reject;
		$scope.modalResolve			= resolve;
		$scope.data					= data;

		$ionicModal.fromTemplateUrl(template, {
			scope: $scope,
			animation: 'slide-in-up'
		})
		.then(function (modal) {
			$scope.modal = modal;
			modal.show();
		});

		const deferred = $q.defer();
		return deferred.promise;

		function close() {
			$scope.modalReject();
		}

		function reject(err) {
			$scope.modal.remove();
			deferred.reject(err);
		}

		function resolve(res) {
			$scope.modal.remove();
			deferred.resolve(res);
		}
	}
});
