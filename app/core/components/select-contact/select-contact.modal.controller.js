/* global */

import contacts from '../../services/contacts.js';

export default /* @ngInject */ function ($scope) {
	const network = $scope.data.network;

	$scope.cancel = cancel;
	$scope.select = select;

	const contactList = contacts.forNetwork(network);
	if ($scope.data.filter) {
		$scope.contacts = contactList.filter($scope.data.filter, $scope.data.bind);
	} else {
		$scope.contacts = contactList;
	}

	$scope.contacts = $scope.contacts.map(tuple => tuple[0]);

	function cancel() {
		$scope.closeModalService();
	}

	function select(contact) {
		$scope.modalResolve(contact);
	}
}
