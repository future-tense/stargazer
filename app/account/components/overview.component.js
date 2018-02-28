/* global angular, console */

import 'ionic-sdk/release/js/ionic.bundle';
import horizon from '../../core/services/horizon.js';

class OverviewController {

	constructor($route, $scope, Wallet, QRScanner) {
		const accountId = $route.current.params.accountId;
		if (accountId) {
			Wallet.current = Wallet.accounts[accountId];
			Wallet.current.clearBadgeCount();
		}

		this.$scope = $scope;
		this.Wallet = Wallet;
		this.hasCamera = QRScanner.hasCamera;

		this.translationData = {
			number: horizon.getMinimumAccountBalance(Wallet.current.network)
		};
	}

	doRefresh() {
		this.Wallet.current.refresh()
		.then(() => {
			this.$scope.$broadcast('scroll.refreshComplete');
		})
		.catch(err => {
			this.$scope.$broadcast('scroll.refreshComplete');
			// :TODO: Display some message about not being able to refresh
		});
	}

	getAssets() {
		return this.Wallet.current.balances.filter(item => {
			if (item.asset_type === 'native') {
				return true;
			} else {
				return (item.balance !== '0.0000000');
			}
		});
	}

	isActivated() {
		return this.Wallet.current.isActivated();
	}
}

angular.module('app.component.overview', [])
.component('overview', {
	controller: OverviewController,
	controllerAs: 'vm',
	require: {
		index: '^index'
	},
	templateUrl: 'app/account/components/overview.html'
});
