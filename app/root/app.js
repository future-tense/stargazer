/* global angular, navigator */

import 'ionic-sdk/release/js/ionic.bundle';
import 'angular-route';

import pagesModule from '../pages';
import coreModule from '../core';

import IndexController from './index.component';
import indexTemplate from './index.html';

function /* @ngInject */ backButton($ionicPlatform, $rootScope, $route) {

	$rootScope.goBack = () => window.history.back();

	$ionicPlatform.registerBackButtonAction(() => {
		if ($route.current.locals.$template !== '<overview></overview>') {
			$rootScope.goBack();
		} else {
			navigator.app.exitApp();
		}
	}, 100);
}

function /* @ngInject */ routeChange($rootScope, $location, Wallet) {

	$rootScope.$on('$routeChangeStart', (event, next, current) => {
		if (Wallet.accountList.length === 0) {
			if (next.$$route.template === '<overview></overview>') {
				$location.path('/page/add-account');
			}
		}
	});
}

angular.module('app', [
	'ngRoute',
	'ionic',
	pagesModule.name,
	coreModule.name
], function ($compileProvider) {
	$compileProvider.aHrefSanitizationWhitelist(/^\s*((https?|mailto|file|chrome-extension|market):)|#/);
})
.component('index', {
	controller: IndexController,
	controllerAs: 'vm',
	template: indexTemplate
})
.run(backButton)
.run(routeChange);
