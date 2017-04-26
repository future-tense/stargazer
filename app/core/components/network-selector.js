/* global angular */

(function () {
	'use strict';

	class NetworkSelectorController {

		constructor(Horizon) {
			this.networks = Horizon.getNetworks();
			this.Horizon = Horizon;
		}

		$onInit() {
			if (!this.network) {
				this.network = this.Horizon.public;
			}
		}

		hash(network) {
			return this.Horizon.getHash(network.phrase);
		}
	}

	angular.module('app')
	.component('networkSelector', {
		bindings: {
			network: '='
		},
		controller: NetworkSelectorController,
		controllerAs: 'vm',
		templateUrl: 'app/core/templates/network-selector.html'
	});
}());

