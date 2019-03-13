
import contacts from '../../core/services/contacts.js';

export default /* @ngInject */ function ($route, $scope) {

	$scope.cancel = cancel;
	$scope.saveContact = saveContact;
	$scope.onValidAddress = onValidAddress;

	$scope.advanced		= false;

	function cancel() {
		$scope.closeModalService();
	}

	function onValidAddress(destInfo) {
		if (destInfo && destInfo.id !== $scope.data.id && destInfo.memo_type !== '') {
			$scope.data.destInfo = destInfo;
			/* eslint-disable camelcase */
			$scope.data.memo		= destInfo.memo;
			$scope.data.memo_type	= destInfo.memo_type;
			/* eslint-enable camelcase */
		}
	}

	function saveContact() {

		const contact = {
			id:			$scope.data.destInfo.id,
			network:	$scope.data.network
		};

		if ($scope.data.memo) {
			contact.memo = $scope.data.memo;
		}

		if ($scope.data.memo_type) {
			/* eslint-disable camelcase */
			contact.memo_type = $scope.data.memo_type;
			/* eslint-enable camelcase */
		}

		contacts.add($scope.data.name, contact);
		$scope.closeModalService();
		$route.reload();
	}
}

