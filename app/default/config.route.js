/* global angular */

angular.module('app')
.config(function ($routeProvider) {
	'use strict';

	$routeProvider
	.when('/', {
		templateUrl: 'app/account/views/home.html',
		controller: 'HomeCtrl'
	});
});
