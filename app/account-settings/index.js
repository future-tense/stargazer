/* global angular*/

import 'ionic-sdk/release/js/ionic.bundle';

import './components/account-alias.component.js';
import './components/account-federation.component.js';
import './components/account-settings.component.js';
import './components/account-signers.component.js';
import './components/account-trustlines.component.js';
import './components/advanced-settings.component.js';
import './components/config-navbar.component.js';
import './components/delete-account.component.js';
import './components/export-account.component.js';
import './components/inflation-destination.component.js';

import './directives/equal-to.directive.js';
import './directives/focus-if.directive.js';
import './directives/valid-federation.directive.js';

import './modals/add-password.controller.js';
import './modals/add-trustline.controller.js';
import './modals/remove-password.controller.js';

import routes from './config.route.js';

angular.module('app.settings', [
	'app.component.account-alias',
	'app.component.account-federation',
	'app.component.account-settings',
	'app.component.account-signer',
	'app.component.account-trustlines',
	'app.component.advanced-settings',
	'app.component.config-navbar',
	'app.component.delete-account',
	'app.component.export-account',
	'app.component.inflation-destination',

	'app.directive.equal-to',
	'app.directive.focus-if',
	'app.directive.valid-federation',

	'app.modal.add-password',
	'app.modal.add-trustline',
	'app.modal.remove-password'
])
.config(routes);
