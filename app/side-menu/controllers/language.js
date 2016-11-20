/* global angular, console, StellarSdk */

angular.module('app')
.controller('LanguageCtrl', function ($rootScope, $scope, Language) {
	'use strict';

	$scope.choice		= Language.getCurrent();
	$scope.languages	= Language.getLanguages();

	$scope.setLanguage = function (code) {
		Language.setCurrent(code);
		$rootScope.goBack();
	};
});

