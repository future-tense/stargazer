
const pools = {
	'XLMPool.com': 'GA3FUYFOPWZ25YXTCA73RK2UGONHCO27OHQRSGV3VCE67UEPEFEDCOPA',
	'Lumenaut.net': 'GCCD6AJOYZCUAQLX32ZJF2MKFFAUJ53PVCFQI3RHWKL3V47QYE2BNAUT'
};

export default /* @ngInject */ function ($scope) {

	$scope.pools = Object.keys(pools);
	$scope.cancel = cancel;
	$scope.select = select;

	function cancel() {
		$scope.closeModalService();
	}

	function select(res) {
		const pool = pools[res];
		$scope.modalResolve(pool);
	}
}
