/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

import './components/send.component.js';
import './directives/qrcode.directive.js';

import routes from './config.route.js';

angular.module('app.account', [
	'app.component.send',
	'app.directive.qrcode'
])
.config(routes);
