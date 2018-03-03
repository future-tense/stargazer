
/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

import qrScannerModule from '../../core/components/qr-scanner';

import OverviewController from './overview.component';
import overviewTemplate from './overview.html';

import AccountInfoController from './account-info.component.js';
import accountInfoTemplate from './account-info.html';

import accountActivityController from './account-activity.directive.js';

import AccountRequestController from './account-requests.component.js';
import accountRequestTemplate from './account-requests.html';

import WalletHeaderController from './wallet-header.component.js';
import walletHeaderTemplate from './wallet-header.html';

import WalletFooterController from './wallet-footer.component.js';
import walletFooterTemplate from './wallet-footer.html';

import routes from './config.route.js';

export default angular.module('homePageModule', [
	qrScannerModule.name
])

.component('overview', {
	controller: OverviewController,
	controllerAs: 'vm',
	require: {
		index: '^index'
	},
	template: overviewTemplate
})

.component('accountInfo', {
	controller: AccountInfoController,
	controllerAs: 'vm',
	template: accountInfoTemplate
})

.component('accountRequests', {
	controller: AccountRequestController,
	controllerAs: 'vm',
	template: accountRequestTemplate
})

.directive('accountActivity', accountActivityController)

.component('walletHeader', {
	controller: WalletHeaderController,
	controllerAs: 'vm',
	require: {
		index: '^index'
	},
	template: walletHeaderTemplate
})

.component('walletFooter', {
	controller: WalletFooterController,
	controllerAs: 'vm',
	template: walletFooterTemplate
})

.config(routes);
