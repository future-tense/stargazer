/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

import './components/advanced-toggle.component.js';
import './components/index.component.js';
import './components/memo-selector.component.js';
import './components/network-selector.component';
import selectContactModule from './components/select-contact';

import './directives/account-name.js';
import './directives/dynamic.js';
import './directives/ext-href.js';
import './directives/jazzicon.js';
import './directives/on-enter.js';
import './directives/on-esc.js';
import './directives/qr-scanner.js';
import './directives/unique-name.js';
import './directives/valid-address.js';
import './directives/valid-password.js';
import './directives/valid-seed.js';

import './filters/format-amount.js';
import './filters/format-date.js';
import './filters/translate.filter.js';

import './modals/review-submit.controller.js';
import './modals/scanner.controller.js';
import './modals/select-account.controller.js';
import './modals/submit-password.controller.js';

import './services/anchors.js';
import './services/centaurus.js';
import './services/commands.js';
import './services/constellation.js';
import './services/destination.js';
import './services/history.js';
import './services/keychain.js';
import './services/ledger-nano.js';
import './services/modal.js';
import './services/qr-decoder.js';
import './services/qr-scanner.js';
import './services/reverse.js';
import './services/reviewer.js';
import './services/signer.js';
import './services/submitter.js';
import './services/transactions.js';
import './services/wallet.js';

angular.module('app.core', [
	'app.component.advanced-toggle',
	'app.component.index',
	'app.component.memo-selector',
	'app.component.network-selector',
	selectContactModule.name,

	'app.directive.account-name',
	'app.directive.dynamic',
	'app.directive.ext-href',
	'app.directive.jazzicon',
	'app.directive.on-enter',
	'app.directive.on-esc',
	'app.directive.qr-scanner',
	'app.directive.unique-name',
	'app.directive.valid-address',
	'app.directive.valid-password',
	'app.directive.valid-seed',

	'app.filter.format-amount',
	'app.filter.format-date',
	'app.filter.translate',

	'app.modals.review-submit',
	'app.modals.scanner',
	'app.modals.select-account',
	'app.modals.submit-password',

	'app.service.anchors',
	'app.service.commands',
	'app.service.constellation',
	'app.service.destination',
	'app.service.history',
	'app.service.keychain',
	'app.service.ledger-nano',
	'app.service.modal',
	'app.service.qr-decoder',
	'app.service.qr-scanner',
	'app.service.reverse',
	'app.service.reviewer',
	'app.service.signer',
	'app.service.submitter',
	'app.service.transactions',
	'app.service.wallet',
]);
