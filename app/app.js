/* global angular, navigator */

import 'ionic-sdk/release/js/ionic.bundle';
import 'angular-route';

import homePageModule from './pages/home';
import receivePageModule from './pages/receive';
import transactionPageModule from './pages/transaction';

import './account/index.js';
import './account-settings/index.js';
import './core/index.js';
import './side-menu/index.js';

const mod =
angular.module('app', [
	'ngRoute',
	'ionic',

	homePageModule.name,
	receivePageModule.name,
	transactionPageModule.name,
	'app.core',
	'app.account',
	'app.settings',
	'app.side-menu'
], function ($compileProvider) {
	$compileProvider.aHrefSanitizationWhitelist(/^\s*((https?|mailto|file|chrome-extension|market):)|#/);
});

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
