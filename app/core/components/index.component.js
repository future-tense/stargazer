/* global angular */

(function () {
	'use strict';

	class IndexController {
		constructor($window, Commands) {
			this.physicalScreenWidth = $window.innerWidth;
			this.Commands = Commands;

			angular.element($window).bind('resize', () => {
				this.physicalScreenWidth = $window.innerWidth;
			});
		}

		onQrCodeScanned(data) {
			this.Commands.onQrCodeScanned(data);
		}
	}

	angular.module('app')
	.component('index', {
		controller: IndexController,
		templateUrl: 'app/core/components/index.html'
	});
}());
