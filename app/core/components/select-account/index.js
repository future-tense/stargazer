/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';
import SelectAccountController from './select-account.component';
import SelectAccountModalController from './select-account.modal.controller';
import selectAccountTemplate from './select-account.html';

export default angular.module('selectAccountModule', [])
.component('selectAccount', {
	bindings: {
		network: '=',
		destination: '=',
		filter: '=',
		bind: '='
	},
	controller: SelectAccountController,
	controllerAs: 'vm',
	template: selectAccountTemplate
})
.controller('SelectAccountCtrl', SelectAccountModalController);

