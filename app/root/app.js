/* global angular, navigator */

import 'ionic-sdk/release/js/ionic.bundle';
import 'angular-route';

import storage from '../core/services/storage';

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
		if (next.$$route.template === '<overview></overview>') {
			if (Wallet.accountList.length === 0) {
				$location.path('/page/add-account');
			}
		}

		else if (next.$$route.template === '<add-account></add-account>') {
			const check = storage.getItem('acceptedTOS');
			if (check === null || (check !== null && check === false)) {
				$location.path('/page/disclaimer');
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
