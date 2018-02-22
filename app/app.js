/* global angular, navigator */

import 'ionic-sdk/release/js/ionic.bundle';
import 'angular-route';

import './account/index.js';
import './account-settings/index.js';
import './core/index.js';
import './side-menu/index.js';

import accountRoutes from './account/config.route.js';
import settingRoutes from './account-settings/config.route.js';
import sideMenuRoutes from './side-menu/config.route.js';

const mod =
angular.module('app', [
	'ngRoute',
	'ionic',

	'app.core',
	'app.account',
	'app.settings',
	'app.side-menu'
], function ($compileProvider) {
	$compileProvider.aHrefSanitizationWhitelist(/^\s*((https?|mailto|file|chrome-extension|market):)|#/);
});

mod.config(accountRoutes);
mod.config(settingRoutes);
mod.config(sideMenuRoutes);

mod.run(function ($ionicPlatform, $rootScope, $route, $window) {

	console.log('run');

	$rootScope.goBack = () => $window.history.back();

	$ionicPlatform.registerBackButtonAction(function () {
		if ($route.current.locals.$template !== '<overview></overview>') {
 			$rootScope.goBack();
		} else {
			navigator.app.exitApp();
		}
	}, 100);
});

mod.run(function ($rootScope, $location, Wallet) {

	$rootScope.$on('$routeChangeStart', function (event, next, current) {
		if (Wallet.accountList.length === 0) {
			if (next.$$route.template === '<overview></overview>') {
				$location.path('/side-menu/add-account');
			}
		}
	});
});

import de from '../i18n/de.json';
import en from '../i18n/en.json';
import es from '../i18n/es.json';
import fil from '../i18n/fil.json';
import fr from '../i18n/fr.json';
import hi from '../i18n/hi.json';
import id from '../i18n/id.json';
import pl from '../i18n/pl.json';
import sv from '../i18n/sv.json';
import zh from '../i18n/zh.json';

mod.constant('TranslationMaps', {
	de: de,
	en: en,
	es: es,
	fil: fil,
	fr: fr,
	hi: hi,
	id: id,
	pl: pl,
	sv: sv,
	zh: zh
});
