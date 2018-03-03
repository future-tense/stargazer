/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

import AboutAppController from './about-app.component';
import aboutAppTemplate from './about-app.html';

import ContactListController from './contact-list.component';
import contactListTemplate from './contact-list.html';

import EditContactController from './edit-contact.component';
import editContactTemplate from './edit-contact.html';

import GlobalSettingsController from './global-settings.component';
import globalSettingsTemplate from './global-settings.html';

import LanguageController from './language.component';
import languageTemplate from './language.html';

import addContactController from './add-contact.controller';

import routes from './config.route.js';

export default angular.module('globalSettingsPageModule', [])
.component('aboutApp', {
	controller: AboutAppController,
	controllerAs: 'vm',
	template: aboutAppTemplate
})
.component('contactList', {
	controller: ContactListController,
	controllerAs: 'vm',
	template: contactListTemplate
})
.component('editContact', {
	controller: EditContactController,
	controllerAs: 'vm',
	template: editContactTemplate
})
.component('globalSettings', {
	controller: GlobalSettingsController,
	controllerAs: 'vm',
	template: globalSettingsTemplate
})
.component('language', {
	controller: LanguageController,
	controllerAs: 'vm',
	template: languageTemplate
})
.controller('AddContactCtrl', addContactController)
.config(routes);
