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

mod.run(function ($ionicPlatform, $rootScope, $route) {

	$rootScope.goBack = () => window.history.back();

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
