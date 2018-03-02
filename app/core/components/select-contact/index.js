/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';
import SelectContactController from './select-contact.controller';
import SelectContactModal from './select-contact.modal.controller';

import selectContactTemplate from './select-contact.html';

export default angular.module('selectContactModule', [])
.component('selectContact', {
	bindings: {
		network: '=',
		destination: '=',
		filter: '=',
		bind: '='
	},
	controller: SelectContactController,
	controllerAs: 'vm',
	template: selectContactTemplate
})
.controller('SelectContactCtrl', SelectContactModal);
