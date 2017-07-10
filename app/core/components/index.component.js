/* global angular */

(function () {
	'use strict';

	class IndexController {
		constructor($ionicLoading, $window, Commands, platformInfo, Translate) {
			this.$ionicLoading = $ionicLoading;
			this.Commands = Commands;
			this.platformInfo = platformInfo;
			this.Translate = Translate;

			this.physicalScreenWidth = $window.innerWidth;
			angular.element($window).bind('resize', () => {
				this.physicalScreenWidth = $window.innerWidth;
			});
		}

		onQrCodeScanned(data) {
			this.Commands.onQrCodeScanned(data);
		}

		copyToClipboard(text) {
			if (this.platformInfo.isCordova) {
				window.cordova.plugins.clipboard.copy(text);
				this.showPopover();
			}

			else if (this.platformInfo.isElectron) {
				const electron = require('electron');
				electron.clipboard.writeText(text);
				this.showPopover();
			}
		}

		showPopover() {
			const text = this.Translate.instant('tabs.receive.copy');
			return this.$ionicLoading.show({
				template: text,
				duration: 700
			});
		}
	}

	angular.module('app')
	.component('index', {
		controller: IndexController,
		templateUrl: 'app/core/components/index.html'
	});
}());
