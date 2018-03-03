
export default /* @ngInject */ function (Wallet) {
	return {
		require: 'ngModel',
		scope: {
			network: '='
		},
		link: function (scope, element, attributes, ngModel) {
			ngModel.$validators.validFunder = function (name) {

				if (!name) {
					return true;
				}

				return Wallet.hasAccount(name, scope.network);
			};
		}
	};
}
