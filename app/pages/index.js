/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

import accountSettingsPageModule from './account-settings';
import addAccountPageModule from './add-account';
import disclaimerPageModule from './disclaimer';
import globalSettingsPageModule from './global-settings';
import homePageModule from './home';
import receivePageModule from './receive';
import sendPageModule from './send';
import sideMenuPageModule from './side-menu';
import transactionPageModule from './transaction';

export default angular.module('pagesModule', [
	accountSettingsPageModule.name,
	addAccountPageModule.name,
	disclaimerPageModule.name,
	globalSettingsPageModule.name,
	homePageModule.name,
	receivePageModule.name,
	sendPageModule.name,
	sideMenuPageModule.name,
	transactionPageModule.name
]);
