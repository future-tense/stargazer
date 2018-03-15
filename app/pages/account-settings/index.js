/* global angular*/

import 'ionic-sdk/release/js/ionic.bundle';

import AccountAliasController from './account-alias.component';
import accountAliasTemplate from './account-alias.html';

import AccountSettingsController from './account-settings.component';
import accountSettingsTemplate from './account-settings.html';

import AccountSignersController from './account-signers.component';
import accountSignersTemplate from './account-signers.html';

import AccountTrustlinesController from './account-trustlines.component';
import accountTrustlinesTemplate from './account-trustlines.html';

import AdvancedSettingsController from './advanced-settings.component';
import advancedSettingsTemplate from './advanced-settings.html';

import CloseAccountController from './close-account.component';
import closeAccountTemplate from './close-account.html';

import DeleteAccountController from './delete-account.component';
import deleteAccountTemplate from './delete-account.html';

import ExportAccountController from './export-account.component';
import exportAccountTemplate from './export-account.html';

import InflationDestinationController from './inflation-destination.component';
import inflationDestinationTemplate from './inflation-destination.html';

import RecoveryPhraseController from './recovery-phrase.component';
import recoveryPhraseTemplate from './recovery-phrase.html';

import addPasswordModal from './add-password.controller';
import addTrustlineModal from './add-trustline.controller';
import removePasswordModal from './remove-password.controller';
import selectPoolModal from './select-pool';

import equalTo from './equal-to.directive';
import focusIf from './focus-if.directive';
import validAnchor from './valid-anchor';
import validFederation from './valid-federation.directive';

import routes from './config.route.js';

export default angular.module('accountSettingsPageModule', [])
.component('accountAlias', {
	controller: AccountAliasController,
	controllerAs: 'vm',
	template: accountAliasTemplate
})
.component('accountSettings', {
	controller: AccountSettingsController,
	controllerAs: 'vm',
	template: accountSettingsTemplate
})
.component('accountSigners', {
	controller: AccountSignersController,
	controllerAs: 'vm',
	template: accountSignersTemplate
})
.component('accountTrustlines', {
	controller: AccountTrustlinesController,
	controllerAs: 'vm',
	template: accountTrustlinesTemplate
})
.component('advancedSettings', {
	controller: AdvancedSettingsController,
	controllerAs: 'vm',
	template: advancedSettingsTemplate
})
.component('closeAccount', {
	controller: CloseAccountController,
	controllerAs: 'vm',
	template: closeAccountTemplate
})
.component('deleteAccount', {
	controller: DeleteAccountController,
	controllerAs: 'vm',
	template: deleteAccountTemplate
})
.component('exportAccount', {
	controller: ExportAccountController,
	controllerAs: 'vm',
	require: {
		index: '^index'
	},
	template: exportAccountTemplate
})
.component('inflationDestination', {
	controller: InflationDestinationController,
	controllerAs: 'vm',
	template: inflationDestinationTemplate
})
.component('recoveryPhrase', {
	controller: RecoveryPhraseController,
	controllerAs: 'vm',
	template: recoveryPhraseTemplate
})
.controller('AddPasswordCtrl', addPasswordModal)
.controller('AddTrustlineCtrl', addTrustlineModal)
.controller('RemovePasswordCtrl', removePasswordModal)
.controller('SelectPoolCtrl', selectPoolModal)
.directive('equalTo', equalTo)
.directive('focusIf', focusIf)
.directive('validAnchor', validAnchor)
.directive('validFederation', validFederation)
.config(routes);
