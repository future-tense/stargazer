
export default /* @ngInject */function ($timeout) {
	return {
		link: function (scope, element, attrs) {
			attrs.$observe('focusIf', val => {
				$timeout(() => {
					if (val) {
						element[0].focus();
					} else {
						element[0].blur();
					}
				});
			});
		}
	};
}
