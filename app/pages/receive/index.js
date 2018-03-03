/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

import ReceiveController from './receive.component.js';
import receiveTemplate from './receive.html';

import paymentRequestController from './payment-request.controller.js';

import routes from './config.route';

export default angular.module('receivePageModule', [])

.component('receive', {
	controller: ReceiveController,
	controllerAs: 'vm',
	require: {
		index: '^index'
	},
	template: receiveTemplate
})

.controller('PaymentRequestCtrl', paymentRequestController)

.config(routes);
