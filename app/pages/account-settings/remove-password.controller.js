
export default /* @ngInject */ function ($scope) {

	$scope.form  = {};
	$scope.model = {};
	$scope.signer = $scope.data.signer;

	$scope.removePassword = function () {
		if ($scope.form.passwordForm.$valid) {
			$scope.modalResolve($scope.model.password);
		}
	};

	$scope.cancel = function () {
		$scope.closeModalService();
	};
}
