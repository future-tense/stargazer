/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';
import SelectContactController from './select-contact.controller';
import SelectContactModal from './select-contact.modal.controller';

export default angular.module('selectContactModule', [])
.component('selectContact', {
	bindings: {
		network: '=',
		destination: '=',
		filter: '='
	},
	controller: SelectContactController,
	controllerAs: 'vm',
	templateUrl: 'app/core/components/select-contact/select-contact.html'
})
.controller('SelectContactCtrl', SelectContactModal);
