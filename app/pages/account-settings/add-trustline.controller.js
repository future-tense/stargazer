
export default /* @ngInject */ function ($scope, Destination) {
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
}
