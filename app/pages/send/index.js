/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

import SendController from './send.component';
import sendTemplate from './send.html';

import routes from './config.route.js';

export default angular.module('sendPageModule', [])
.component('send', {
	controller: SendController,
	controllerAs: 'vm',
	template: sendTemplate
})
.config(routes);
