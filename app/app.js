/* global angular, navigator, nw, require, StellarSdk */

angular.module('app', [
	'pascalprecht.translate',
	'ngRoute',
	'ionic'
], function ($compileProvider) {
	'use strict';
	$compileProvider.aHrefSanitizationWhitelist(/^\s*((https?|mailto|file|chrome-extension|market):)|#/);
})

.run(function ($ionicPlatform, $rootScope, $route, $window) {
	'use strict';

	$rootScope.goBack = function() {
		$window.history.back();
	};

	$ionicPlatform.registerBackButtonAction(function () {
		if ($route.current.controller !== 'OverviewCtrl') {
			$rootScope.goBack();
		} else {
			navigator.app.exitApp();
		}
	}, 100);
})

.config(['$translateProvider', function ($translateProvider) {
	'use strict';

	$translateProvider
	.useSanitizeValueStrategy('escape')
	.addInterpolation('$translateMessageFormatInterpolation')
	.fallbackLanguage('en');

	$translateProvider.translations('en', /* @include ../i18n/en.json */);
	$translateProvider.translations('es', /* @include ../i18n/es.json */);
	$translateProvider.translations('fil', /* @include ../i18n/fil.json */);
	$translateProvider.translations('fr', /* @include ../i18n/fr.json */);
	$translateProvider.translations('hi', /* @include ../i18n/hi.json */);
	$translateProvider.translations('id', /* @include ../i18n/id.json */);
	$translateProvider.translations('pl', /* @include ../i18n/pl.json */);
	$translateProvider.translations('sv', /* @include ../i18n/sv.json */);
	$translateProvider.translations('zh', /* @include ../i18n/zh.json */);
}]);
