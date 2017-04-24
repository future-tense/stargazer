/* global angular, console */

angular.module('app')
.controller('AddTrustlineCtrl', function ($scope, Destination) {
	'use strict';

	$scope.form = {};
	$scope.model = {
		asset: 'dummy'
	};

	$scope.setPassword = function () {
		$scope.heading = 'modal.password.confirm';
		$scope.confirm = true;
	};

	$scope.$watch('form.trustline.anchor.$valid', function (isValid, lastValue) {
		Destination.lookup($scope.model.anchor)
		.then(() => {
			$scope.model.asset = '';
			$scope.showAsset = true;
		})
		.catch(() => {
			$scope.model.asset = 'dummy';
			$scope.showAsset = false;
		});
	});

	$scope.add = function () {
		$scope.modalResolve({
			anchor: $scope.model.anchor,
			asset:  $scope.model.asset
		});
	};

	$scope.cancel = function () {
		$scope.closeModalService();
	};
})
.directive('validAnchor', function ($q, Anchors, Destination) {
	'use strict';

	function any(list) {
		let counter = 0;
		function resolve(res) {
			counter += 1;
			return res;
		}
		function reject(err) {
			return err;
		}

		return $q.all(list.map(item => item.then(resolve, reject)))
		.then(res => {
			if (counter >= 1) {
				return res;
			} else {
				return $q.reject();
			}
		});
	}

	return {
		require: 'ngModel',
		link: function (scope, element, attributes, ngModel) {
			ngModel.$asyncValidators.validAnchor = function (name) {
				return any([
					Anchors.lookup(name),
					Destination.lookup(name)
				]);
			};
		}
	};

});
