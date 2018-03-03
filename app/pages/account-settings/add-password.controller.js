
export default /* @ngInject */ function ($scope) {
	$scope.form = {};
	$scope.model = {};
	$scope.confirm = false;
	$scope.heading = 'modal.password.set';

	$scope.setPassword = function () {
		$scope.heading = 'modal.password.confirm';
		$scope.confirm = true;
	};

	$scope.confirmPassword = function () {
		if ($scope.form.confirmForm.$valid) {
			$scope.modalResolve($scope.model.password);
		}
	};

	$scope.cancel = function () {
		$scope.closeModalService();
	};
}
