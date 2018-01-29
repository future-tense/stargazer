/* global angular, console */


(function () {
	'use strict';

	class OverviewController {

		constructor($route, $scope, Horizon, Wallet) {
			const accountId = $route.current.params.accountId;
			if (accountId) {
				Wallet.current = Wallet.accounts[accountId];
				Wallet.current.clearBadgeCount();
			}

			this.$scope = $scope;
			this.Wallet = Wallet;

			this.translationData = {
				number: Horizon.getMinumumAccountBalance(Wallet.current.network)
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
			return this.Wallet.current.getNativeBalance() !== '0';
		}
	}

	angular.module('app')
	.component('overview', {
		controller: OverviewController,
		controllerAs: 'vm',
		require: {
			index: '^index'
		},
		templateUrl: 'app/account/components/overview.html'
	});
}());
