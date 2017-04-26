/* global angular, console, require */

(function () {
	'use strict';


	class ReceiveController {

		constructor($ionicLoading, $location, $translate, Horizon, Modal, platformInfo, Wallet) {

			this.$ionicLoading = $ionicLoading;
			this.$location = $location;
			this.$translate = $translate;
			this.Horizon = Horizon;
			this.Modal = Modal;
			this.platformInfo = platformInfo;
			this.Wallet = Wallet;

			this.accountId		= Wallet.current.id;
			this.hasFederation	= (Wallet.current.federation !== undefined);
			this.minHeight		= this.getMinHeight();
			this.qrtext			= '';

			if (this.hasFederation) {
				this.federation = `${this.Wallet.current.federation}*getstargazer.com`;
			}

			this.showAddress();
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

		getMinHeight() {
			const headerHeight = 2 * 40;
			const numButtons = 1 + (this.Wallet.current.federation === undefined);
			const buttonGroupHeight = 48 * numButtons + 8 * (numButtons - 1) + 24;
			return `${window.innerHeight - (buttonGroupHeight + headerHeight)}px`;
		}

		request() {
			this.Modal.show('app/account/modals/payment-request.html');
		}

		setFederation() {
			this.$location.path('/account-settings/federation');
		}

		showAddress() {
			const account = {
				id: this.Wallet.current.id
			};

			if (this.Wallet.current.network !== this.Horizon.public) {
				account.network = this.Wallet.current.network;
			}

			this.qrtext = JSON.stringify({
				stellar: {
					account: account
				}
			});
		}

		showPopover() {
			const text = this.$translate.instant('tabs.receive.copy');
			return this.$ionicLoading.show({
				template: text,
				duration: 700
			});
		}
	}

	angular.module('app')
	.component('receive', {
		controller: ReceiveController,
		controllerAs: 'vm',
		templateUrl: 'app/account/views/receive.html'
	});
}());
