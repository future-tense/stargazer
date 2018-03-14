/* global angular, require */

import translate from '../core/services/translate.service.js';
import platformInfo from '../core/services/platform-info.js';

export default class IndexController {

	/* @ngInject */
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
		const text = translate.instant('page.receive.copy');
		return this.$ionicLoading.show({
			template: text,
			duration: 700
		});
	}
}
