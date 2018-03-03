
export default /* @ngInject */ function ($routeProvider) {

	$routeProvider
	.when('/page/transaction/:id', {
		template: '<transaction></transaction>'
	});
};
