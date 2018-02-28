/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';
import SelectAccountController from './select-account.component';
import SelectAccountModalController from './select-account.modal.controller';

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
	templateUrl: 'app/core/components/select-account/select-account.html'
})
.controller('SelectAccountCtrl', SelectAccountModalController);

