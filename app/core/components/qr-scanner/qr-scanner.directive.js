
export default /* @ngInject */ function (QRScanner) {

	function controller($scope) {
		$scope.openScanner = function () {
			QRScanner.open()
			.then(data => {
				$scope.onScan({
					data: data
				});
			});
		};
	}

	controller.$inject = ['$scope'];

	return {
		restrict: 'E',
		scope: {
			onScan: '&'
		},
		controller: controller,
		replace: true,
		template: '<a id="camera-icon" class="p10" ng-click="openScanner()"><i class="icon-scan size-21"></i></a>'
	};
}
