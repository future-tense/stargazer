/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

import DisclaimerController from './disclaimer.component';
import disclaimerTemplate from './disclaimer.html';

import routes from './config.routes';

export default angular.module('disclaimerPageModule', [])
.component('disclaimer', {
	controller: DisclaimerController,
	controllerAs: 'vm',
	template: disclaimerTemplate
})
.config(routes);
