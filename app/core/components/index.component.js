/* global angular, require */

import 'ionic-sdk/release/js/ionic.bundle';
import translate from '../../core/services/translate.service.js';
import platformInfo from '../../core/services/platform-info.js';

import indexTemplate from './index.html';

class IndexController {
	constructor($ionicLoading, Commands, Wallet) {
		this.$ionicLoading = $ionicLoading;
		this.Commands = Commands;
		this.Wallet = Wallet;

		this.physicalScreenWidth = window.innerWidth;
		angular.element(window).bind('resize', () => {
			this.physicalScreenWidth = window.innerWidth;
		});
	}

	onQrCodeScanned(data) {
		this.Commands.onQrCodeScanned(data);
	}

	copyToClipboard(text) {
		if (platformInfo.isCordova) {
			window.cordova.plugins.clipboard.copy(text);
			this.showPopover();
		}

		else if (platformInfo.isElectron) {
			const electron = require('electron');
			electron.clipboard.writeText(text);
			this.showPopover();
		}
	}

	hasAccount() {
		return this.Wallet.accountList.length !== 0;
	}

	showPopover() {
		const text = translate.instant('tabs.receive.copy');
		return this.$ionicLoading.show({
			template: text,
			duration: 700
		});
	}
}

angular.module('app.component.index', [])
.component('index', {
	controller: IndexController,
	controllerAs: 'vm',
	template: indexTemplate
});
