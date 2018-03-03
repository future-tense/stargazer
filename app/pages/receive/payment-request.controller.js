
import horizon from '../../core/services/horizon.js';

export default /* @ngInject */ function ($scope, Wallet) {
	$scope.model = {};
	$scope.showResult = false;

	$scope.balances = Wallet.current.balances;

	const assetCodeCollisions = Wallet.getAssetCodeCollisions($scope.balances);

	$scope.getAssetDescription = function (asset) {
		if (asset.asset_type !== 'native') {
			if (asset.asset_code in assetCodeCollisions) {
				return `${asset.asset_code}.${asset.asset_issuer}`;
			} else {
				return asset.asset_code;
			}
		} else {
			return 'XLM';
		}
	};

	$scope.cancel = function () {
		$scope.closeModalService();
	};

	$scope.generateQrCode = function () {

		const payment = {
			destination:	Wallet.current.id,
			amount:			$scope.model.amount
		};

		if (Wallet.current.network !== horizon.public) {
			payment.network = Wallet.current.network;
		}

		if ($scope.model.asset.asset_type !== 'native') {
			payment.asset = {
				code:		$scope.model.asset.asset_code,
				issuer:		$scope.model.asset.asset_issuer
			};
		}

		if ($scope.model.memo_type) {
			payment.memo = {
				type: $scope.model.memo_type,
				value: $scope.model.memo
			};
		}

		const text = {
			stellar: {
				payment: payment
			}
		};

		$scope.text = JSON.stringify(text);
		$scope.showResult = true;
	};
}
