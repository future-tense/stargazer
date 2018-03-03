/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

import './components/about-app.component.js';
import './components/contact-list.component.js';
import './components/edit-contact.component.js';
import './components/global-settings.component.js';
import './components/language.component.js';
import './components/side-menu.component.js';
import './modals/add-contact.controller.js';

import routes from './config.route.js';

angular.module('app.side-menu', [
	'app.component.about-app',
	'app.component.contact-list',
	'app.component.edit-account',
	'app.component.global-settings',
	'app.component.language',
	'app.component.side-menu',
	'app.modal.add-contact'
])
.config(routes);
