/* global angular */

import './components/about-app.component.js';
import './components/add-account.component.js';
import './components/contact-list.component.js';
import './components/create-personal.component.js';
import './components/create-shared.component.js';
import './components/edit-contact.component.js';
import './components/global-settings.component.js';
import './components/import-account.component.js';
import './components/import-centaurus.component.js';
import './components/language.component.js';
import './components/side-menu.component.js';

import './directives/valid-centaurus-password.directive.js';
import './directives/valid-funder.directive.js';
import './directives/valid-password2.directive.js';

import './modals/add-contact.controller.js';
import './modals/select-funder.controller.js';

import 'ionic-sdk/release/js/ionic.bundle';

angular.module('app.side-menu', [
	'app.component.about-app',
	'app.component.add-account',
	'app.component.contact-list',
	'app.component.create-personal',
	'app.component.create-shared',
	'app.component.edit-account',
	'app.component.global-settings',
	'app.component.import-account',
	'app.component.import-centaurus',
	'app.component.language',
	'app.component.side-menu',

	'app.directive.valid-centaurus-password',
	'app.directive.valid-funder',
	'app.directive.valid-password2',

	'app.modal.add-contact',
	'app.modal.select-funder'
]);
