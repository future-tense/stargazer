/* global angular */

import 'ionic-sdk/release/js/ionic.bundle';
import horizon from '../../core/services/horizon.js';

import networkSelectorTemplate from './network-selector.html';

class NetworkSelectorController {

	constructor() {
		this.networks = horizon.getNetworks();
	}

	$onInit() {
		if (!this.network) {
			this.network = horizon.public;
		}
	}

	hash(network) {
		return horizon.getHash(network.phrase);
	}
}

angular.module('app.component.network-selector', [])
.component('networkSelector', {
	bindings: {
		network: '='
	},
	controller: NetworkSelectorController,
	controllerAs: 'vm',
	template: networkSelectorTemplate
});

