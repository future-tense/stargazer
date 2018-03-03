
export default /* @ngInject */ function () {
	return {
		require: 'ngModel',
		scope: {
			otherModelValue: '=equalTo'
		},
		link: function (scope, element, attributes, ngModel) {
			ngModel.$validators.equalTo = function (modelValue) {
				return modelValue === scope.otherModelValue;
			};

			scope.$watch('otherModelValue', () => ngModel.$validate());
		}
	};
}
