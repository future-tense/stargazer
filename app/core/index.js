/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

import selectAccountModule from './components/select-account';
import selectContactModule from './components/select-contact';
import selectFromQRModule from './components/select-from-qr';
import qrScannerModule from './components/qr-scanner';
import txReviewerModule from './components/tx-reviewer';

import './components/advanced-toggle.component.js';
import './components/memo-selector.component.js';
import './components/network-selector.component';
import './components/config-navbar.component';

import './directives/account-name.js';
import './directives/dynamic.js';
import './directives/ext-href.js';
import './directives/jazzicon.js';
import './directives/on-enter.js';
import './directives/on-esc.js';
import './directives/qrcode.directive';
import './directives/unique-name.js';
import './directives/valid-address.js';
import './directives/valid-password.js';
import './directives/valid-seed.js';

import './filters/format-amount.js';
import './filters/format-date.js';
import './filters/translate.filter.js';

import './modals/submit-password.controller.js';

import './services/anchors.js';
import './services/commands.js';
import './services/constellation.js';
import './services/destination.js';
import './services/history.js';
import './services/keychain.js';
import './services/modal.js';
import './services/reverse.js';
import './components/tx-reviewer/signer.service.js';
import './components/tx-reviewer/submitter.service.js';
import './services/transactions.js';
import './services/wallet.js';

export default angular.module('coreModule', [
	selectAccountModule.name,
	selectContactModule.name,
	selectFromQRModule.name,
	qrScannerModule.name,
	txReviewerModule.name,
	'app.component.advanced-toggle',
	'app.component.memo-selector',
	'app.component.network-selector',
	'app.component.config-navbar',

	'app.directive.account-name',
	'app.directive.dynamic',
	'app.directive.ext-href',
	'app.directive.jazzicon',
	'app.directive.on-enter',
	'app.directive.on-esc',
	'app.directive.qrcode',
	'app.directive.unique-name',
	'app.directive.valid-address',
	'app.directive.valid-password',
	'app.directive.valid-seed',

	'app.filter.format-amount',
	'app.filter.format-date',
	'app.filter.translate',

	'app.modals.submit-password',

	'app.service.anchors',
	'app.service.commands',
	'app.service.constellation',
	'app.service.destination',
	'app.service.history',
	'app.service.keychain',
	'app.service.modal',
	'app.service.reverse',
	'app.service.transactions',
	'app.service.wallet',
]);
