import horizon from '../../core/services/horizon';

export default /* @ngInject */ function ($scope, Wallet) {

	$scope.cancel = cancel;
	$scope.select = select;

	$scope.accounts = getAccounts();

	function getAccounts() {
		const network = $scope.data.network;
		const minimum = $scope.data.minimum || 20;
		const numOps  = $scope.data.numOps || 1;


		const accountList = Wallet.accountList
		.filter(item => item.network === network)
		.filter(item => item.canSend(minimum, numOps))
		.map(item => item.alias);

		if ($scope.data.friendbot && horizon.getNetwork(network).name === 'Testnet') {
			return ['Friendbot', ...accountList];
		} else {
			return accountList;
		}
	}

	function cancel() {
		$scope.closeModalService();
	}

	function select(contact) {
		$scope.modalResolve(contact);
	}
}
