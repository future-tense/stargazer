
export default/* @ngInject */ function ($scope, Wallet) {

	const network = $scope.data.network;

	$scope.cancel = cancel;
	$scope.select = select;

	$scope.heading	= $scope.data.heading;

	const accountList = getAccounts();
	if ($scope.data.filter) {
		$scope.accounts = accountList.filter($scope.data.filter, $scope.data.bind);
	} else {
		$scope.accounts = accountList;
	}

	function getAccounts() {
		return Wallet.accountList
		.filter(item => item.network === network)
		.map(item => item.alias);
	}

	function cancel() {
		$scope.closeModalService();
	}

	function select(contact) {
		$scope.modalResolve(contact);
	}
};
