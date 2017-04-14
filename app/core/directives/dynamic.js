
angular.module('app')
.directive('dynamic', function ($compile) {
	return {
		restrict: 'A',
		replace: true,
		link: (scope, element, attributes) => {
			scope.$watch(attributes.dynamic, html => {
				element.html(html);
				$compile(element.contents())(scope);
			});
		}
	};
});
