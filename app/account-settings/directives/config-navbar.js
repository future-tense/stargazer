/* global angular */

angular.module('app')
.directive('configNavbar', function ($rootScope) {
	'use strict';

	function link(scope, element, attr) {
		scope.goBack = $rootScope.goBack;
	}

	return {
		restrict: 'AE',
		scope: {
			heading: '@',
			back: '@'
		},
		link: link,
		templateUrl: 'app/account-settings/templates/config-navbar.html'
	};
});
