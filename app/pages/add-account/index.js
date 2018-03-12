/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';

import qrScannerModule from '../../core/components/qr-scanner';

import AddAccountController from './add-account.component';
import addAccountTemplate from './add-account.html';

import CreatePersonalController from './create-personal.component';
import createPersonalTemplate from './create-personal.html';

import CreateSharedController from './create-shared.component';
import createSharedTemplate from './create-shared.html';

import ImportAccountController from './import-account.component';
import importAccountTemplate from './import-account.html';

import ImportPhraseController from './import-phrase.component';
import importPhraseTemplate from './import-phrase.html';

import ImportCentaurusController from './import-centaurus.component';
import importCentaurusTemplate from './import-centaurus.html';

import selectFunderController from './select-funder.controller';

import validCentaurusPassword from './valid-centaurus-password.directive';
import validFunder from './valid-funder.directive';
import validPassword2 from './valid-password2.directive';
import validPhrase from './valid-phrase.directive';

import routes from './config.route';

export default angular.module('addAccountPageModule', [
	qrScannerModule.name
])
.component('addAccount', {
	controller: AddAccountController,
	controllerAs: 'vm',
	template: addAccountTemplate
})
.component('createPersonal', {
	controller: CreatePersonalController,
	controllerAs: 'vm',
	template: createPersonalTemplate
})
.component('createShared', {
	controller: CreateSharedController,
	controllerAs: 'vm',
	template: createSharedTemplate
})
.component('importAccount', {
	controller: ImportAccountController,
	controllerAs: 'vm',
	template: importAccountTemplate
})
.component('importPhrase', {
	controller: ImportPhraseController,
	controllerAs: 'vm',
	template: importPhraseTemplate
})
.component('importCentaurus', {
	controller: ImportCentaurusController,
	controllerAs: 'vm',
	template: importCentaurusTemplate
})
.controller('SelectFundingAccountCtrl', selectFunderController)
.directive('validCentaurusPassword', validCentaurusPassword)
.directive('validFunder', validFunder)
.directive('validPassword2', validPassword2)
.directive('validPhrase', validPhrase)
.config(routes);
