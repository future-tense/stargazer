/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

angular.module('app.service.modal', [])
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

		$scope.modal = $ionicModal.fromTemplate(template, {
			scope: $scope,
			animation: 'slide-in-up'
		});
		$scope.modal.show();

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
