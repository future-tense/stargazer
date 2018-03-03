
import contacts from '../../core/services/contacts.js';

export default /* @ngInject */ function ($route, $scope) {

	$scope.cancel = cancel;
	$scope.saveContact = saveContact;
	$scope.onValidAddress = onValidAddress;

	$scope.advanced		= false;
	$scope.model		= {};

	function cancel() {
		$scope.closeModalService();
	}

	function onValidAddress(destInfo) {
		if (destInfo && destInfo.id !== $scope.model.id && destInfo.memo_type !== '') {
			$scope.model.destInfo = destInfo;
			/* eslint-disable camelcase */
			$scope.model.memo		= destInfo.memo;
			$scope.model.memo_type	= destInfo.memo_type;
			/* eslint-enable camelcase */
		}
	}

	function saveContact() {

		const contact = {
			id:			$scope.model.destInfo.id,
			network:	$scope.model.network
		};

		if ($scope.model.memo) {
			contact.memo = $scope.model.memo;
		}

		if ($scope.model.memo_type) {
			/* eslint-disable camelcase */
			contact.memo_type = $scope.model.memo_type;
			/* eslint-enable camelcase */
		}

		contacts.add($scope.model.name, contact);
		$scope.closeModalService();
		$route.reload();
	}
}

