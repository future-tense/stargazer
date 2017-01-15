/* global angular */

angular.module('app')
.directive('networkSelector', function (Horizon) {
	'use strict';

	return {
		scope: {
			network: '='
		},
		link: function(scope, element, attributes) {

			if (!scope.network) {
				scope.network = Horizon.public;
			}

			scope.networks = Horizon.getNetworks();
			scope.hash = function (network) {
				return Horizon.getHash(network.phrase);
			};
		},
		templateUrl: 'app/core/templates/network-selector.html'
	};

});
