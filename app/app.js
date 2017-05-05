/* global angular, navigator, require, StellarSdk */

angular.module('app', [
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
		if ($route.current.locals.$template !== '<overview></overview>') {
 			$rootScope.goBack();
		} else {
			navigator.app.exitApp();
		}
	}, 100);
})

.constant('TranslationMaps', {
	/* jshint ignore:start */
	en: /* @include ../i18n/en.json */,
	es: /* @include ../i18n/es.json */,
	fil: /* @include ../i18n/fil.json */,
	fr: /* @include ../i18n/fr.json */,
	hi: /* @include ../i18n/hi.json */,
	id: /* @include ../i18n/id.json */,
	pl: /* @include ../i18n/pl.json */,
	sv: /* @include ../i18n/sv.json */,
	zh: /* @include ../i18n/zh.json */
	/* jshint ignore:end */
});
