/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

import './components/account-info.component.js';
import './components/account-requests.component.js';
import './components/overview.component.js';
import './components/receive.component.js';
import './components/send.component.js';
import './components/transaction.component.js';
import './components/wallet-footer.component.js';
import './components/wallet-header.component.js';

import './directives/account-activity.directive.js';
import './directives/qrcode.directive.js';

import './modals/add-contact.controller.js';
import './modals/edit-txcomment.controller.js';
import './modals/payment-request.controller.js';

import routes from './config.route.js';

angular.module('app.account', [
	'app.component.account-info',
	'app.component.account-requests',
	'app.component.overview',
	'app.component.receive',
	'app.component.send',
	'app.component.transaction',
	'app.component.wallet-footer',
	'app.component.wallet-header',
	'app.directive.account-activity',
	'app.directive.qrcode',
	'app.modal.add-contact-from-tx',
	'app.modal.edit-txcomment',
	'app.modal.payment-request'
])
.config(routes);
